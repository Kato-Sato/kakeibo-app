import { useState } from "react";
import { TransactionLineDetail } from "@/domain/transaction";
import { updateTransactionLines } from "@/repositories/transactions";
import { toError } from "@/lib/errors";
import { type EditLineDraft, collectChangedLines, draftToLine } from "@/components/TransactionForm/draft";

export function useTransactionEdit(lines: TransactionLineDetail[], onSaved: () => void) {
    const [edits, setEdits] = useState<Map<number, EditLineDraft>>(new Map());
    const [selected, setSelected] = useState(new Set<number>());
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    
    
    function startEdit() {
        setSelected(new Set());
        setEdits(new Map());
        setEditing(true);
        setSaveError(null);
    }

    function cancelEdit() {
        setSelected(new Set());
        setEdits(new Map());
        setEditing(false);
        setSaveError(null);
    }

    async function save() {
        setSaving(true);
        const changedLines = collectChangedLines(edits, lines);
        const newLines = [];
        for (const { id, draft } of changedLines) {
            const result = draftToLine(draft);
            if (!result.ok) {
                setSaveError(`${result.message}`);
                setSaving(false);
                return;
            }
            newLines.push({id, update: result.value});
        }
    
        try {
            await updateTransactionLines(newLines);
            setEdits(new Map());
            setEditing(false);
            setSaveError(null);
        } catch (err) {
            setSaveError(toError(err).message);
        } finally {
            setSaving(false);
            onSaved();
        }
    }

    function changeLine(id: number, draft: EditLineDraft) {
        setEdits((prev) => {
            const newMap = new Map(prev);
            newMap.set(id, draft);
            return newMap;
        });
    }

    return { editing, edits, saving, saveError, startEdit, cancelEdit, save, changeLine };
}