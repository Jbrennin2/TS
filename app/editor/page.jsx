import Editor from "./editor"
import Header from "../components/header"
export default function Page() {

    return (
        <div className="flex flex-col items-center justify-evenly min-h-screen bg-gray-100">
            <Header/>
            <Editor/>
        </div> 
    )
}