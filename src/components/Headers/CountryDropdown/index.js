import Button from '@mui/material/Button';
import { FaAngleDown } from "react-icons/fa";

const CountryDropdown = () => {
    return (
        <>
        <Button sx={{ color: '#000' }} className='countryDrop'>
            <div className='info d-flex flex-column'>
                <span className='label'> Your Country </span>
                <span className='name'> india</span>

            </div> 
            <span className='ml-auto'><FaAngleDown/></span>
        </Button>
        </>
    )
}

export default CountryDropdown;