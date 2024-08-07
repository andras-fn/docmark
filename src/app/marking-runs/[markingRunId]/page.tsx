import Viewer from "./_components/Viewer";

const page = ({ params }: { params: any }) => {
  const { markingRunId } = params;
  return (
    <div className="p-2 h-screen max-h-screen">
      <Viewer markingRunId={markingRunId} />
    </div>
  );
};
export default page;
