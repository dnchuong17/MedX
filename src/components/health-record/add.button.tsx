import { Plus } from "lucide-react";

type Props = {
    onClick: () => void;
};

export default function AddButton({ onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="bg-indigo-600 rounded-full p-3 shadow-lg hover:bg-indigo-700 transition-colors"
        >
            <Plus className="text-white w-6 h-6" />
        </button>
    );
}
