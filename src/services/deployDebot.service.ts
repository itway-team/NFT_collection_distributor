import * as fs from 'fs';
import path from 'path';
import { Account } from '@tonclient/appkit';
import { TonClient } from '@tonclient/core';
import { libNode } from '@tonclient/lib-node';
import { globals } from '../config/globals'
import { everscale_settings } from '../config/everscale-settings';


export class DeployDebotService {
    private client: TonClient;

    constructor() {
        TonClient.useBinaryLibrary(libNode);

        this.client = new TonClient({
            network: {
                endpoints: [everscale_settings.ENDPOINTS]
            }
        });
    }

    async deployDebot(contactsDir) {
        let walletAcc = await this.getWalletAcc();
        let debotAbi = await JSON.parse(fs.readFileSync(path.resolve(contactsDir, "debots", "contracts", "MintingDebot.abi.json")).toString());
        let debotTvc = fs.readFileSync(path.resolve(contactsDir, "debots", "contracts", "MintingDebot.tvc"), {encoding: 'base64'});
        let debotAcc = new Account({
            abi: debotAbi,
            tvc: debotTvc
        }, {
            signer: {
                type: "Keys",
                keys: everscale_settings.KEYS
            }
        });
        let debotAddress = await debotAcc.getAddress();
        await walletAcc.run(
            "sendTransaction",
            {
                dest: debotAddress,
                value: 2_000_000_000,
                flags: 2,
                bounce: false,
                payload: "",
            }
        );
        try {
            await this.client.processing.process_message({
                message_encode_params: {
                    abi: debotAcc.abi,
                    signer: {
                        type: "Keys",
                        keys: everscale_settings.KEYS
                    },
                    address: debotAddress,
                    deploy_set: {
                        tvc: debotTvc
                    },
                    call_set: {
                        function_name: "constructor"
                    },
                },
                send_events: false,
            });
            console.log("Debot address: " + debotAddress);
        } catch(err) {
            console.log(err);
        }
    }

    // This is a SafeMultisig Wallet contract for testing purposes.
    // In TON OS SE this contract is predeployed at 0:d5f5cfc4b52d2eb1bd9d3a8e51707872c7ce0c174facddd0e06ae5ffd17d2fcd 
    // address with one single custodian and its initial balance is about 1 million tokens.
    private async getWalletAcc() : Promise<Account> {
        let walletAbi = await JSON.parse(fs.readFileSync(path.resolve(globals.SAMPLE_DATA_PATH, "safeMultisigWallet", "SafeMultisigWallet.abi.json")).toString());
        let walletTvc = fs.readFileSync(path.resolve(globals.SAMPLE_DATA_PATH, "safeMultisigWallet", "SafeMultisigWallet.tvc"), {encoding: 'base64'});
        const walletAcc = new Account(
            {
                abi: walletAbi, 
                tvc: walletTvc
            },
            {
                client: this.client,
                address: everscale_settings.SAFE_MULTISIG_ADDRESS,
                signer: {
                    type: "Keys",
                    keys: everscale_settings.SAFE_MULTISIG_KEYS
                }
            }
        );
        return walletAcc;
    }
}