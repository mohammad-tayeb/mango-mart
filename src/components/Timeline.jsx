export default function Timeline({ history }) {
    return (
        <>
            {history.map((item, index) => (
                <div key={index} className="flex">
                    <div className="flex flex-col items-center mr-4">
                        <div className="w-5 h-5 rounded-full bg-green-500" />

                        {index !== history.length - 1 && (
                            <div className="w-1 h-12 bg-green-500" />
                        )}
                    </div>

                    <div className="pb-8">
                        <h4 className="font-semibold">{item.status}</h4>

                        <p className="text-sm text-gray-500">
                            {new Date(item.time).toLocaleString()}
                        </p>

                        {item.note && (
                            <p className="text-xs text-gray-400">
                                {item.note}
                            </p>
                        )}

                        {item.updatedBy && (
                            <p className="text-xs text-gray-400">
                                Updated by: {item.updatedBy}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}