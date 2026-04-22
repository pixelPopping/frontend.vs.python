import CalendarLib from 'react-calendar'; 

function Calender({ onChange, value, selectRange }) {
    return (
        <div className="calendar-wrapper">
            <CalendarLib 
                onChange={onChange} 
                value={value} 
                selectRange={selectRange} 
            />
        </div>
    );
}

export default Calender;
