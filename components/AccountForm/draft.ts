import { type AccountType, type NewAccount } from "@/domain/account";
import { Result, ok, err } from "@/lib/results";

export type AccountDraft = {
    name: string;
    accountType: AccountType;
    parentAccountId?: number | null;
    sortOrder: number;
}

export function draftToAccount(draft: AccountDraft): Result<NewAccount> {
    if (!draft.name) return err("口座名が未入力です");
    if (!draft.accountType) return err("口座種別が未選択です");

    return ok({
        name: draft.name.trim(),
        accountType: draft.accountType,
        parentAccountId: draft.parentAccountId ?? null,
        sortOrder: draft.sortOrder
    });
}