import Link from "next/link";
import { MessageSquare } from "lucide-react";

import { Button } from "../ui/button";
import { ModeToggle } from "../ui/mode-toggler";

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-violet-500 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold tracking-tight">EchoLayer</span>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    {["Features", "Pricing", "Docs"].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/auth/login">Sign in</Link>
                    </Button>
                    <Button
                        size="sm"
                        className="bg-violet-500 hover:bg-violet-600 text-white"
                        asChild
                    >
                        <Link href="/auth/register">Get started free</Link>
                    </Button>
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
}
export default Navbar;