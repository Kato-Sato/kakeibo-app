import { SUBMIT_BUTTON_CLASS } from "@/components/formStyle";

export default function EditButton({inEdit, onClick}: {
    inEdit: boolean
    onClick: () => void
}) {
    return (
        inEdit
            ? <button onClick={onClick} className={SUBMIT_BUTTON_CLASS}>保存</button>
            : <button onClick={onClick} className={SUBMIT_BUTTON_CLASS}>編集</button>
    );
}