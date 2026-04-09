import Link from "next/link";

const DocumentCard = ({ document }) => {
  return (
<Link
  href={`/documents/${document._id}`} // /documents/${document.id}
>
  <div className="bg-slate-900 border border-cyan-900 rounded-lg overflow-hidden shadow-lg shadow-cyan-900/30 hover:shadow-cyan-500/40 hover:border-cyan-400 transition-all duration-300 cursor-pointer group">
    <img
      src={`${document.imageUrl}`}
      alt="img"
      className="w-full h-48 object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300 border-b border-cyan-900/50"
    />
    <div className="p-5">
      <h3 className="font-bold text-xl text-cyan-300 margin mb-2 group-hover:text-cyan-100 transition-colors">Name: {document.title}</h3>
      <p className="text-md text-slate-400 margin line-clamp-2 mb-4">
        <span className="font-bold text-cyan-600">description: </span>
        {document.description}
      </p>
      <div className="flex justify-between items-center pt-4 border-t border-cyan-900/50">
        <span className="font-bold text-lg text-cyan-50 margin bg-cyan-950 px-3 py-1 rounded-md border border-cyan-800">price: Rs {document.price}</span>
        <span className="font-semibold text-md text-cyan-400">creator:{document.creator?.name || "Anonymous"}</span>
      </div>
        <span className="font-bold text-md padding margin text-white-400">Email: { document.creator?.email || "Anonymous"}</span>
    </div>
  </div>
</Link>
  );
};

export default DocumentCard;
