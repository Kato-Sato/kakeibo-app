import { type AccountBalance } from "@/domain/account"; 

export default function AccountBalanceList({balances}: {balances: AccountBalance[]}) {
    // console.log(balances);
    return (
        <div>
            {balances.map((balance) => (
                <div key={balance.id}>
                    {balance.name}: {balance.balance}
                </div>
            ))}
        </div>
    );
}