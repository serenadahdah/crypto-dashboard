"use client";

import { AppBanner } from "@/components/app/app-banner";
import { AppCard } from "@/components/app/app-card";
import { AppEmptyState } from "@/components/app/app-empty-state";
import { AppInput } from "@/components/app/app-input";
import { AppLoadingButton } from "@/components/app/app-loading-button";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Send,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { isAddress, parseEther, type Address } from "viem";
import {
  useAccount,
  useChainId,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from "wagmi";
import { sepolia } from "wagmi/chains";

type TransactionStatus =
  | "idle"
  | "pending"
  | "confirming"
  | "success"
  | "error";

const getErrorMessage = (error: Error): string => {
  const message = error.message.toLowerCase();
  if (message.includes("user rejected") || message.includes("user denied")) {
    return "Transaction was rejected by user.";
  }
  if (message.includes("insufficient funds")) {
    return "Insufficient funds for this transaction.";
  }
  if (message.includes("nonce")) {
    return "Nonce error. Please try again.";
  }
  if (message.includes("gas")) {
    return "Gas estimation failed. The transaction may fail.";
  }
  return error.message.slice(0, 100) || "An unknown error occurred.";
};

export function SendEthForm() {
  const { address: walletAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>(
    {},
  );
  const isOnSepolia = chainId === sepolia.id;

  const {
    sendTransaction,
    data: txHash,
    isPending: isSending,
    isError: isSendError,
    reset: resetSendTransaction,
  } = useSendTransaction();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isConfirmError,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (chainId) {
      resetSendTransaction();
    }
  }, [chainId, resetSendTransaction]);

  useEffect(() => {
    if (isConfirmed && txHash) {
      toast.success("Transaction Confirmed!", {
        description: "Your ETH has been sent successfully.",
        classNames: { description: "!text-foreground" },
      });
      setRecipient("");
      setAmount("");
    }
  }, [isConfirmed, txHash]);

  useEffect(() => {
    if (isConfirmError && confirmError) {
      toast.error("Transaction Failed", {
        description: "The transaction failed to confirm.",
        classNames: { description: "!text-foreground" },
      });
    }
  }, [isConfirmError, confirmError]);

  const getTransactionStatus = (): TransactionStatus => {
    if (isSending) return "pending";
    if (isConfirming) return "confirming";
    if (isConfirmed) return "success";
    if (isSendError || isConfirmError) return "error";
    return "idle";
  };

  const status = getTransactionStatus();

  const validateForm = (): boolean => {
    const newErrors: { recipient?: string; amount?: string } = {};

    if (!recipient.trim()) {
      newErrors.recipient = "Recipient address is required";
    } else if (!isAddress(recipient)) {
      newErrors.recipient = "Invalid Ethereum address";
    } else if (recipient.toLowerCase() === walletAddress?.toLowerCase()) {
      newErrors.recipient = "Cannot send to yourself";
    }

    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else {
      const numAmount = Number.parseFloat(amount);
      if (Number.isNaN(numAmount) || numAmount <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      } else if (numAmount > 10) {
        newErrors.amount = "Maximum 10 ETH for safety (testnet)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    resetSendTransaction();

    sendTransaction(
      {
        to: recipient as Address,
        value: parseEther(amount),
        chainId: sepolia.id,
      },
      {
        onError(error) {
          toast.error("Transaction Failed", {
            description: getErrorMessage(error),
            classNames: { description: "!text-foreground" },
          });
        },
      },
    );
  };

  if (!isConnected) {
    return (
      <AppEmptyState
        icon={<Wallet />}
        title="Wallet Not Connected"
        description="Connect your wallet to send ETH"
      />
    );
  }

  return (
    <AppCard
      title="Send ETH (Sepolia Testnet)"
      icon={<Send className="h-5 w-5" />}
      description="Send test ETH on Sepolia network"
    >
      {!isOnSepolia && (
        <AppBanner
          variant="warning"
          title="Wrong Network"
          description="Please switch to Sepolia testnet to send transactions."
        >
          <AppLoadingButton
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => switchChain({ chainId: sepolia.id })}
            disabled={isSwitchingChain}
            isLoading={isSwitchingChain}
            loadingLabel="Switching..."
            label="Switch to Sepolia"
          />
        </AppBanner>
      )}

      {status !== "idle" && status !== "error" && txHash && (
        <div className="mb-4 rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            {status === "pending" || status === "confirming" ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
            <div className="flex-1">
              <p className="font-medium">
                {status === "pending"
                  ? "Sending transaction..."
                  : status === "confirming"
                    ? "Waiting for confirmation..."
                    : "Transaction confirmed!"}
              </p>
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
              >
                View on Etherscan
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AppInput
          id="recipient"
          label="Recipient Address"
          error={errors.recipient || null}
          placeholder="0x..."
          value={recipient}
          onChange={(e) => {
            setRecipient(e.target.value);
            if (errors.recipient) {
              setErrors((prev) => ({ ...prev, recipient: undefined }));
            }
          }}
          disabled={status === "pending" || status === "confirming"}
        />

        <AppInput
          id="amount"
          type="number"
          step="0.0001"
          min="0"
          placeholder="0.01"
          error={errors?.amount}
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            if (errors.amount) {
              setErrors((prev) => ({ ...prev, amount: undefined }));
            }
          }}
          disabled={status === "pending" || status === "confirming"}
        />
        <AppLoadingButton
          type="submit"
          className="w-full"
          icon={<Send className="h-4 w-4" />}
          label="Send ETH"
          loadingLabel={status === "pending" ? "Sending..." : "Confirming..."}
          isLoading={status === "pending" || status === "confirming"}
        />
      </form>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        This is a testnet transaction. Get free Sepolia ETH from{" "}
        <a
          href="https://sepoliafaucet.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          sepoliafaucet.com
        </a>
      </p>
    </AppCard>
  );
}
