import { SUBMIT_BUTTON_CLASS } from "@/components/formStyle";

export default function EditPanel({editing, onSave, onEdit, onCancel, disabled}: {
    editing: boolean
    onSave: () => void
    onEdit: () => void
    onCancel: () => void
    disabled?: boolean
}) {
    return (
        editing
            ? (
                <div>
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
                </div>
            )
            
    );
}