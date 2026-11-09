import { useState } from "react";
import { TransactionLineDetail } from "@/domain/transaction";
import { updateTransactionLines, createTransactionGroups, assignLinesToGroup } from "@/repositories/transactions";
import { toError } from "@/lib/errors";
import { type EditLineDraft, collectChangedLines, draftToLine, draftToGroups, type NewGroupDraft } from "@/components/TransactionForm/draft";
export function useTransactionEdit(lines: TransactionLineDetail[], onSaved: () => void) {
    const [edits, setEdits] = useState<Map<number, EditLineDraft>>(new Map());
    const [selected, setSelected] = useState(new Set<number>());
    const [groupName, setGroupName] = useState("");
    const [groups, setGroups] = useState<NewGroupDraft[]>([]);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    
    
    function startEdit() {
        setSelected(new Set());
        setEdits(new Map());
        setGroups([]);
        setEditing(true);
        setSaveError(null);
    }

    function cancelEdit() {
        setSelected(new Set());
        setEdits(new Map());
        setGroups([]);
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
            const idByKey = await createTransactionGroups(
                groups.map((g) => ({ key: g.key, name: g.name, parentGroupId: null }))
            );
            await Promise.all(groups.map(async (g) => {
                const groupId = idByKey.get(g.key);
                if (groupId === undefined) throw new Error(`グループ「${g.name}」の作成結果が見つかりません`);
                await assignLinesToGroup([...g.lineIds], groupId);
            }));
            setSelected(new Set());
            setEdits(new Map());
            setGroups([]);
            setEditing(false);
            setSaveError(null);
        } catch (err) {
            setSaveError(toError(err).message);
        } finally {
            setSaving(false);
            onSaved();
        }
    }

    function toggleSelect(id: number) {
        setSelected((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }

    function changeLine(id: number, draft: EditLineDraft) {
        setEdits((prev) => {
            const newMap = new Map(prev);
            newMap.set(id, draft);
            return newMap;
        });
    }

    function groupSelected() {
        if (selected.size === 0) return;
        setGroups((prev) => {
            const newGroups = [...prev, { key: crypto.randomUUID(), name: groupName, lineIds: new Set(selected) }];
            return newGroups;
        })
        setSelected(new Set());
    }

    return {
        editing,
        selected,
        edits,
        saving,
        saveError,
        startEdit,
        cancelEdit,
        save,
        toggleSelect,
        changeLine,
        setGroupName,
        groupSelected
    };
}