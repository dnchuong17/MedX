"use client";

import { FC, ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import {SolletExtensionWalletAdapter, SolletWalletAdapter} from "@solana/wallet-adapter-sollet";

// Default styles for wallet adapter UI
import "@solana/wallet-adapter-react-ui/styles.css";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const endpoint = "https://api.devnet.solana.com";
    const network = WalletAdapterNetwork.Devnet;

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new SolletExtensionWalletAdapter(),
            new SolletWalletAdapter({ network })
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <SolanaWalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </SolanaWalletProvider>
        </ConnectionProvider>
    );
};
