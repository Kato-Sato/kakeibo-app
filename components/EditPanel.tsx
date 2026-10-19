import { SUBMIT_BUTTON_CLASS } from "@/components/formStyle";

export default function EditPanel({editing, setGroupName, onGroup, onSave, onCancel, onEdit, onReload, disabled}: {
    editing: boolean
    setGroupName: (name: string) => void
    onGroup: () => void
    onSave: () => void
    onCancel: () => void
    onEdit: () => void
    onReload: () => void
    disabled?: boolean
}) {
    return (
        editing
            ? (
                <div>
                    <form>
                        <input
                            type="text"
                            placeholder="グループ名"
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                            className="w-full rounded border px-3 py-2"
                        />
                        <button type="button" onClick={() => onGroup()} className={SUBMIT_BUTTON_CLASS} disabled={disabled}>
                            {disabled ? <span>保存中</span> : <span>グループ化</span>}
                        </button>
                    </form>
                    
                    <button onClick={onSave} className={SUBMIT_BUTTON_CLASS} disabled={disabled}>
                        {disabled ? <span>保存中</span> : <span>保存</span>}
                    </button>
                    <button onClick={onCancel} className={SUBMIT_BUTTON_CLASS} disabled={disabled}>
                        {disabled ? <span>保存中</span> : <span>キャンセル</span>}
                    </button>
                </div>
            ) : (
                <div>
                    <button onClick={onEdit} className={SUBMIT_BUTTON_CLASS}>編集</button>
                    <button onClick={onReload} className={SUBMIT_BUTTON_CLASS}>更新</button>
                </div>
            )
            
    );
}