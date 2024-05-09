import { Link } from "react-router-dom"
import { navLinks } from "../constants"
import { useState } from "react"

const Navbar = () => {
    const [active, setActive] = useState(0);

    const handleActive = (i) => {
        setActive(i);
    }
    return (
        <div className="flex items-center justify-between bg-zinc-100 shadow-lg h-16 px-2">
            <div>
                <h3 className="font-oswald  font-bold text-xl text-blue-900">Dev diaries</h3>
            </div>
            <div>
                <ul className="flex items-center justify-between">
                    {navLinks.map((el, index) => (
                        <li key={index} className={`mr-8 font-oswald text-md font-bold text-gray-500 ${active === index ? 'text-blue-800' : ''}`} onClick={() => handleActive(index)}>
                            <Link to={el.link}>{el.name}</Link>
                        </li>

                    ))}
                    <li className="font-oswald text-md font-bold text-gray-500">Create a blog</li>
                </ul>
            </div>
        </div >
    )
}

export default Navbar