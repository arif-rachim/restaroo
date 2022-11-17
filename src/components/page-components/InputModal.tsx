import {StoreValue, useStore} from "../store/useStore";
import {useEffect, useId, useState} from "react";
import {Button} from "./Button";
import {IoCalendar} from "react-icons/io5";
import {ButtonTheme} from "../../routes/Theme";
import style from "./InputModal.module.css";
import {useAppContext} from "../useAppContext";

export function InputModal() {
    const [date, setDate] = useState(new Date());
    const {appDimension} = useAppContext();
    return <div style={{
        height: '100%',
        background: 'rgba(0,0,0,0.8)',
        position: 'absolute',
        top: 0,
        width: appDimension.width,
        overflow: 'hidden'
    }}>
        <Calendar value={date} onChange={(val) => setDate(val)}/>
    </div>
}


const currentYear = new Date().getFullYear();

function toCalendarFormat(value: Date) {
    const day = value.getDate() - 1;
    const month = value.getMonth();
    const year = currentYear - value.getFullYear();
    return {day, month, year};
}

function toDateFormat(props: { day: number, month: number, year: number }) {
    const date = new Date(props.day + 1, props.month, currentYear - props.year);
    return date;
}

const ROW_HEIGHT = 50;

interface KeyValue {
    key: number,
    value: string,
}

function updateAnimation(compKey: string, selectedIndex: number) {

    [0].map(val => document.getElementById(`${compKey}${selectedIndex + val}`)).forEach(element => {
        if (element === null) {
            return;
        }
        element.setAttribute('class', style.focusOne);
    });
    [-1, 1].map(val => document.getElementById(`${compKey}${selectedIndex + val}`)).forEach(element => {
        if (element === null) {
            return;
        }
        element.setAttribute('class', style.focusTwo);
    });
    [-2, 2].map(val => document.getElementById(`${compKey}${selectedIndex + val}`)).forEach(element => {
        if (element === null) {
            return;
        }
        element.setAttribute('class', style.focusThree);
    });
    [-3, 3].map(val => document.getElementById(`${compKey}${selectedIndex + val}`)).forEach(element => {
        if (element === null) {
            return;
        }
        element.setAttribute('class', style.focusFour);
    });
    [-4, 4].map(val => document.getElementById(`${compKey}${selectedIndex + val}`)).forEach(element => {
        if (element === null) {
            return;
        }
        element.setAttribute('class', style.focusFour);
    });
    [-5, 5].map(val => document.getElementById(`${compKey}${selectedIndex + val}`)).forEach(element => {
        if (element === null) {
            return;
        }
        element.setAttribute('class', style.focusFour);
    });
}

function ListSelector(props: { value?: number, onChange?: (param: number) => void, data: KeyValue[], width?: number | string }) {
    const {value, data, width, onChange} = props;
    const compKey = useId();
    useEffect(() => {
        updateAnimation(compKey, value ?? 0);
        const component = document.getElementById(`${compKey}component`);
        if(component === null){
            return;
        }
        component.scrollTop = ROW_HEIGHT * (value ?? 0);
    }, [compKey, value]);
    return <div style={{
        height: '100%',
        overflow: 'auto',
        position: 'relative',
        scrollSnapType: 'y mandatory',
        boxSizing: 'border-box',
        width: width,
        overflowX: 'hidden'
    }} onScroll={(event) => {
        const fromTop = (event.target as HTMLDivElement).scrollTop;
        const selectedIndex = Math.round(fromTop / ROW_HEIGHT);
        updateAnimation(compKey, selectedIndex);
        if (onChange) {
            onChange(selectedIndex);
        }
    }} id={`${compKey}component`}>
        {Array.from({length: 3}).map((_, index) => {
            return <div style={{height: ROW_HEIGHT, scrollSnapAlign: 'start',boxSizing:'border-box'}} key={'empty-start-' + index}/>
        })}
        {data.map((item, index) => {

            return <div key={index} style={{
                fontSize: 35,
                border: '1px solid rgba(0,0,0,0)',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0px 5px',
                boxSizing: 'border-box',
                height: ROW_HEIGHT,
                scrollSnapAlign: 'start'
            }} id={`${compKey}container`}>
                <div id={`${compKey}${item.key}`} >{item.value}</div>
            </div>
        })}
        {Array.from({length: 3}).map((_, index) => {
            return <div style={{height: ROW_HEIGHT, scrollSnapAlign: 'start',boxSizing:'border-box'}} key={'empty-end-' + index}/>
        })}
    </div>;
}

const MONTHS: KeyValue[] = [
    {key: 0, value: 'January'},
    {key: 1, value: 'February'},
    {key: 2, value: 'March'},
    {key: 3, value: 'April'},
    {key: 4, value: 'May'},
    {key: 5, value: 'June'},
    {key: 6, value: 'July'},
    {key: 7, value: 'August'},
    {key: 8, value: 'September'},
    {key: 9, value: 'October'},
    {key: 10, value: 'November'},
    {key: 11, value: 'December'}
]

const YEARS: KeyValue[] = Array.from({length: 50}).map((_, index) => {
    const year = currentYear - index;
    return {
        key: index,
        value: `${year}`
    }
})

function Calendar(props: { value: Date, onChange: (value: Date) => void }) {
    const {value, onChange} = props;
    const store = useStore(() => toCalendarFormat(value));
    useEffect(() => {
        const newState = toCalendarFormat(value);
        store.setState(newState);
    }, [value, store]);


    const {appDimension} = useAppContext();
    return <div style={{
        display: 'flex', flexDirection: 'column', bottom: 0,
        position: 'absolute',
        width: appDimension.width,
        backgroundColor: 'white'
    }}>
        <div style={{display: 'flex', flexDirection: 'column', padding: 5}}>
            <Button title={'OK'} onTap={() => onChange(toDateFormat(store.stateRef.current))} icon={IoCalendar}
                    theme={ButtonTheme.promoted}/>
        </div>
        <div style={{
            display: 'flex',
            height: ROW_HEIGHT * 7,
            justifyContent: 'center'
        }}>
            <StoreValue store={store} property={'value'} selector={s => s.day}>
                <ListSelector width={70}
                              data={Array.from({length: 31}).map((_, index) => ({key: index, value: `${index + 1}`}))}
                              onChange={day => store.setState(old => ({...old, day}))}
                />
            </StoreValue>
            <StoreValue store={store} property={'value'} selector={s => s.month}>
                <ListSelector data={MONTHS}
                              onChange={month => store.setState(old => ({...old, month}))}
                />
            </StoreValue>
            <StoreValue store={store} property={'value'} selector={s => s.year}>
                <ListSelector width={120} data={YEARS}
                              onChange={year => store.setState(old => ({...old, year}))}
                />
            </StoreValue>
        </div>
    </div>
}
