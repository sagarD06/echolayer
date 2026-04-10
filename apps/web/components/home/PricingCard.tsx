import Link from "next/link";
import { Check } from "lucide-react";

import { PricingTier } from "@/mock/mockdata_homepage";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const PricingCard = ({ tier }: { tier: PricingTier }) => {
    return (
        <Card
            className={cn(
                "relative flex flex-col",
                tier.featured
                    ? "border-violet-500 border-2 shadow-lg shadow-violet-500/10"
                    : "border-border"
            )}
        >
            {tier.featured && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2">
                    <span className="bg-violet-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Most popular
                    </span>
                </div>
            )}

            <CardHeader className="pb-4">
                <p className="text-sm text-muted-foreground font-medium">{tier.name}</p>
                <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-semibold tracking-tight text-foreground">
                        {tier.price}
                    </span>
                    <span className="text-sm text-muted-foreground">/ {tier.period}</span>
                </div>
                <CardDescription className="text-sm leading-relaxed mt-1">
                    {tier.description}
                </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="flex flex-col gap-4 pt-5 flex-1">
                <ul className="flex flex-col gap-2.5">
                    {tier.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                            <span className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 text-green-700 dark:text-green-400" />
                            </span>
                            {f}
                        </li>
                    ))}
                </ul>

                <div className="mt-auto pt-4">
                    <Button
                        className={cn(
                            "w-full",
                            tier.featured
                                ? "bg-violet-500 hover:bg-violet-600 text-white"
                                : "variant-outline"
                        )}
                        variant={tier.featured ? "default" : "outline"}
                        asChild
                    >
                        <Link href="/auth/register">{tier.cta}</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default PricingCard;