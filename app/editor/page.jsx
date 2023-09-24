import Editor from "./editor"
import Header from "../components/header"
export default function Page() {

    process.env.BLOB_READ_WRITE_TOKEN = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN

    return (
        <div className="flex flex-col items-center justify-evenly min-h-screen bg-gray-100">
            <Header/>
            <Editor/>
        </div> 
    )
}