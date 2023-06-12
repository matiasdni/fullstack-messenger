interface EditChatFormProps {
  chatName: string;
  chatDescription: string;
  setChatName: (name: string) => void;
  setChatDescription: (description: string) => void;
  handleSave: () => void;
}

const EditChatForm: React.FC<EditChatFormProps> = ({
  chatName,
  chatDescription,
  setChatName,
  setChatDescription,
  handleSave,
}) => (
  <>
    <div className="form-control space-y-2 pt-4">
      <input
        type="text"
        className="input input-bordered input-sm"
        onChange={(e) => setChatName(e.target.value)}
        value={chatName}
        maxLength={32}
      />

      <textarea
        className="textarea textarea-sm textarea-bordered break-inside-avoid resize-none"
        onChange={(e) => setChatDescription(e.target.value)}
        maxLength={64}
        value={chatDescription}
      >
        {chatDescription}
      </textarea>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{chatDescription.length}/64</p>
        <button className="btn btn-sm btn-ghost" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  </>
);

export default EditChatForm;
