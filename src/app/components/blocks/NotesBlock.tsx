import { useState, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { NotebookPen, Square, SquareCheckBig } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import TextareaBlock from "@/app/components/blocks/TextareaBlock";
import { useAssessmentStore } from "@/store/assessmentStore";

interface NotesBlockProps {
  domainId: string;
  practiceId: string;
}

const NotesBlock = ({
  domainId,
  practiceId,
}: NotesBlockProps): React.ReactElement => {
  const { t } = useTranslation('forms');
  const setNote = useAssessmentStore(useShallow((state) => state.setNote));
  const toggleFlagged = useAssessmentStore(
    useShallow((state) => state.toggleFlagged),
  );

  const practiceData = useAssessmentStore(
    useShallow((state) => state.formValues[domainId]?.[practiceId]),
  );

  const { note = "", flagged: isFlagged = false } = practiceData || {};

  const [localNote, setLocalNote] = useState(note);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNote(e.target.value);
  };

  const handleBlur = () => {
    if (localNote !== note) {
      setNote(domainId, practiceId, localNote);
    }
  };

  const handleFlagToggle = () => {
    toggleFlagged(domainId, practiceId);
  };

  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  return (
    <div className="rounded-md bg-gray-50">
      <details open={note?.length > 0 || isFlagged}>
        <summary className="flex cursor-pointer items-center rounded-lg p-4 text-sm font-bold text-foreground focus-visible:outline-2 focus-visible:outline-turkoosi [&::-webkit-details-marker]:mr-4">
          <NotebookPen className="mr-2 h-4 w-4" />
          {t('add_note')}
        </summary>
        <div className="mx-4 flex items-center gap-1 pb-2 pl-2">
          <button
            type="button"
            role="checkbox"
            aria-checked={isFlagged}
            onClick={handleFlagToggle}
            className="flex items-center gap-2 rounded-sm text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turkoosi focus-visible:ring-offset-2"
          >
            {isFlagged ? (
              <SquareCheckBig className="h-5 w-5" />
            ) : (
              <Square className="h-5 w-5 text-foreground/60" />
            )}
            <span>{t('mark_for_development')}</span>
          </button>
        </div>
        <div className="mx-4 pb-4">
          <Label htmlFor={`note-${domainId}-${practiceId}`} className="sr-only">
            {t('note')}
          </Label>
          <TextareaBlock
            id={`note-${domainId}-${practiceId}`}
            name="note"
            value={localNote}
            onChange={handleNoteChange}
            onBlur={handleBlur}
            className="[field-sizing:content] min-h-[4lh] mt-2"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {t('note_description')}
          </p>
        </div>
      </details>
    </div>
  );
};

export default NotesBlock;
