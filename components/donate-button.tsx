"use client";
import { useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { donationAbi } from "@/lib/begging-contract/abi/donation";
import { DonationContractAddress } from "@/lib/env";

export default function DonateButton() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("0.01");
  const { isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  // 读取合约数据 --- 读取捐赠人数
  const { data: donorCount } = useReadContract({
    address: DonationContractAddress,
    abi: donationAbi,
    functionName: "donorCount",
    query: {
      enabled: open,
    },
  });
  // 读取捐赠总金额
  const { data: totalDonaionts } = useReadContract({
    address: DonationContractAddress,
    abi: donationAbi,
    functionName: "totalDonaionts",
    query: {
      enabled: open,
    },
  });
  // 读取合约余额
  const { data: contractBalance } = useReadContract({
    address: DonationContractAddress,
    abi: donationAbi,
    functionName: "getContractBalance",
    query: {
      enabled: open,
    },
  });

  const handleDonate = async () => {
    console.log("Donation clicked");
    if (!isConnected) {
      alert("请先通过平台右上角连接钱包");
      return;
    }
    if (Number(amount) <= 0) {
      alert("捐赠金额必须大于0");
      return;
    }
    await writeContractAsync({
      address: DonationContractAddress,
      abi: donationAbi,
      functionName: "donate",
      value: parseEther(amount.toString() || "0"),
    });
    setOpen(false);
    setAmount("0.01");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">打赏</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>支持作者</DialogTitle>
          <DialogDescription>通过捐赠来支持作者的工作</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>捐赠人数</span>
            <span className="font-semibold">
              {donorCount?.toString() ?? "--"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>捐赠总金额</span>
            <span className="font-semibold">
              {totalDonaionts
                ? `${formatEther(totalDonaionts as bigint)} ETH`
                : "--"}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>合约余额</span>
            <span>
              {contractBalance
                ? `${formatEther(contractBalance as bigint)} ETH`
                : "--"}
            </span>
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <label className="text-xs text-muted-foreground">捐赠金额(ETH)</label>
          <Input
            type="number"
            min={0}
            step={0.001}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <DialogFooter className="gap-2">
          <Button
            onClick={handleDonate}
            disabled={!isConnected || isPending}
            className="w-full"
          >
            {isPending
              ? "发送中..."
              : isConnected
              ? "确认捐赠"
              : "请先连接钱包"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
