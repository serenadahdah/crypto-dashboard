"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useSwitchChain,
  useChainId,
} from "wagmi";
import { parseEther, isAddress, type Address } from "viem";
import { sepolia } from "wagmi/chains";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Send,
  Wallet,
  AlertTriangle,
} from "lucide-react";

type TransactionStatus =
  | "idle"
  | "pending"
  | "confirming"
  | "success"
  | "error";

interface Notification {
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

export function SendEthForm() {
  const { address: walletAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>(
    {}
  );
  const [notification, setNotification] = useState<Notification | null>(null);

  const isOnSepolia = chainId === sepolia.id;

  const {
    sendTransaction,
    data: txHash,
    isPending: isSending,
    isError: isSendError,
    error: sendError,
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

  const getTransactionStatus = (): TransactionStatus => {
    if (isSending) return "pending";
    if (isConfirming) return "confirming";
    if (isConfirmed) return "success";
    if (isSendError || isConfirmError) return "error";
    return "idle";
  };

  const status = getTransactionStatus();

  const getErrorMessage = useCallback((error: Error): string => {
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
  }, []);

  // Show notification on status changes
  useEffect(() => {
    if (isConfirmed && txHash) {
      setNotification({
        type: "success",
        title: "Transaction Confirmed!",
        message: "Your ETH has been sent successfully.",
      });
      // Reset form on success
      setRecipient("");
      setAmount("");
    }
  }, [isConfirmed, txHash]);

  useEffect(() => {
    if (isSendError && sendError) {
      const errorMessage = getErrorMessage(sendError);
      setNotification({
        type: "error",
        title: "Transaction Failed",
        message: errorMessage,
      });
    }
  }, [isSendError, sendError, getErrorMessage]);

  useEffect(() => {
    if (isConfirmError && confirmError) {
      setNotification({
        type: "error",
        title: "Transaction Failed",
        message: "The transaction failed to confirm.",
      });
    }
  }, [isConfirmError, confirmError]);

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
    setNotification(null);

    if (!validateForm()) return;

    resetSendTransaction();

    sendTransaction({
      to: recipient as Address,
      value: parseEther(amount),
      chainId: sepolia.id,
    });
  };

  const handleSwitchToSepolia = () => {
    switchChain({ chainId: sepolia.id });
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  if (!isConnected) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
          <div className="rounded-full bg-muted p-4">
            <Wallet className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Wallet Not Connected</h3>
            <p className="text-sm text-muted-foreground">
              Connect your wallet to send ETH
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send ETH (Sepolia Testnet)
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Send test ETH on Sepolia network
        </p>
      </div>

      {/* Network Warning */}
      {!isOnSepolia && (
        <div className="mb-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-500">Wrong Network</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Please switch to Sepolia testnet to send transactions.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={handleSwitchToSepolia}
                disabled={isSwitchingChain}
              >
                {isSwitchingChain ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Switching...
                  </>
                ) : (
                  "Switch to Sepolia"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 rounded-lg border p-4 ${
            notification.type === "success"
              ? "border-green-500/50 bg-green-500/10"
              : notification.type === "error"
              ? "border-destructive/50 bg-destructive/10"
              : "border-blue-500/50 bg-blue-500/10"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {notification.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              ) : notification.type === "error" ? (
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              )}
              <div>
                <h4
                  className={`font-medium ${
                    notification.type === "success"
                      ? "text-green-500"
                      : notification.type === "error"
                      ? "text-destructive"
                      : "text-blue-500"
                  }`}
                >
                  {notification.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissNotification}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Transaction Status */}
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
        <div>
          <label
            htmlFor="recipient"
            className="text-sm font-medium mb-1.5 block"
          >
            Recipient Address
          </label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
              if (errors.recipient) {
                setErrors((prev) => ({ ...prev, recipient: undefined }));
              }
            }}
            className={errors.recipient ? "border-destructive" : ""}
            disabled={status === "pending" || status === "confirming"}
          />
          {errors.recipient && (
            <p className="text-sm text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.recipient}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="text-sm font-medium mb-1.5 block">
            Amount (ETH)
          </label>
          <Input
            id="amount"
            type="number"
            step="0.0001"
            min="0"
            placeholder="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount) {
                setErrors((prev) => ({ ...prev, amount: undefined }));
              }
            }}
            className={errors.amount ? "border-destructive" : ""}
            disabled={status === "pending" || status === "confirming"}
          />
          {errors.amount && (
            <p className="text-sm text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.amount}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={
            !isOnSepolia || status === "pending" || status === "confirming"
          }
        >
          {status === "pending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : status === "confirming" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Confirming...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send ETH
            </>
          )}
        </Button>
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
    </div>
  );
}
