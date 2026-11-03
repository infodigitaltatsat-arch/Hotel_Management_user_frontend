import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
    return (

        <section className="flex min-h-[60vh] items-center justify-center px-5 py-20">
            <div className="max-w-lg text-center">

                <p className="text-md font-bold uppercase tracking-[0.2em] text-blue-600">
                    Error 404
                </p>

                <p className="mt-4 font-serif text-4xl text-slate-900">
                    This page could'nt be found
                </p>

                <p className="mt-4 leading-7 text-slate-600">
                    The page may have moved, or the address may be incorrect.
                </p>

                <Link
                to='/'
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700 ">
                    <ArrowLeft size={17}/>
                    Return Home
                </Link>

            </div>
        </section>
    )
}

export default NotFoundPage