"use client";

import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { shopDetailHref } from "@/lib/finance-nav";

export default function ShopFinanceDetailLink({ shopId }: { shopId: number }) {
  const pathname = usePathname();
  return (
    <Link href={shopDetailHref(pathname, shopId)}>
      <Button variant="ghost" size="icon" className="rounded-full hover:bg-primarycolor hover:text-white transition-all">
        <ArrowRight className="size-5" />
      </Button>
    </Link>
  );
}