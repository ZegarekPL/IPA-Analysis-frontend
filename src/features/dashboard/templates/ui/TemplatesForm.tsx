"use client";

import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useState } from "react";
import TemplatesFormContent from "./TemplatesFormContent";

export default function TemplateForm() {
	const [open, setOpen] = useState(false);

	const handleSuccess = () => {
		toast.success("Szablon dodany 🎉", {
		description: "Nowy szablon został zapisany pomyślnie.",
		});
		setOpen(false);
	};
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<button
				className="p-1 hover:bg-accent rounded-md transition"
				title="Dodaj templatkę"
				>
				<Plus className="h-4 w-4" />
				</button>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
				<AlertDialogTitle>Dodaj nową templatkę</AlertDialogTitle>
				<AlertDialogDescription>
					Wypełnij poniższy formularz, aby utworzyć nowy szablon.
				</AlertDialogDescription>
				</AlertDialogHeader>

				<TemplatesFormContent
					onCancel={() => setOpen(false)}
					onSuccess={() => handleSuccess()}
				/>
			</AlertDialogContent>
		</AlertDialog>
	);
}
