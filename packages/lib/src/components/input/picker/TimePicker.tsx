import {StoreValue, useStore} from "../../utils/useStore";
import {useAfterInit} from "../../utils/useAfterInit";
import {Picker} from "./Picker";
import {Button} from "../../page/Button";
import {IoCalendar} from "react-icons/io5";
import {ButtonTheme} from "../../Theme";
import {useAppDimension} from "../../utils/useAppDimension";
import noNull from "../../utils/noNull";

const defaultDate = new Date();
const nothing = () => {
};

function dateToTime(value: Date) {
    const hours = value.getHours();
    const minutes = value.getMinutes();
    return {hours, minutes, date: value};
}


function timeToDate(props: { hours: number, minutes: number, date: Date }) {
    const date = props.date;
    const newDate = new Date(date.getTime());
    newDate.setHours(props.hours, props.minutes, 0, 0);
    return newDate;
}

export function TimePicker(props: { value?: Date, onChange?: (value: Date) => void }) {

    const value = noNull(props.value, defaultDate);
    const onChange = noNull(props.onChange, nothing);
    const store = useStore(() => dateToTime(value));
    useAfterInit(() => {
        const newState = dateToTime(value);
        store.setState(newState);
    }, [value, store]);
    const {appDimension} = useAppDimension();
    return <div style={{
        display: 'flex', flexDirection: 'column',
        width: appDimension.width,
        backgroundColor: 'white'
    }}>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative'
        }}>
            <StoreValue store={store} property={'value'} selector={s => s.hours}>
                <Picker width={70}
                        data={Array.from({length: 24}).map((_, index) => ({
                            key: index,
                            value: `${(index).toString().padStart(2, '0')}`
                        }))}
                        onChange={hours => store.setState(old => ({...old, hours}))}
                />
            </StoreValue>
            <StoreValue store={store} property={'value'} selector={s => s.minutes}>
                <Picker data={Array.from({length: 60}).map((_, index) => ({
                    key: index,
                    value: `${(index).toString().padStart(2, '0')}`
                }))}
                        onChange={minutes => store.setState(old => ({...old, minutes}))}
                />
            </StoreValue>
            <div style={{
                position: 'absolute',
                width: '100%',
                top: 150,
                height: 50,
                backgroundColor: 'rgba(0,0,0,0.1)'
            }}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', padding: 5}}>
            <Button title={'OK'} onTap={() => onChange(timeToDate(store.stateRef.current))} icon={IoCalendar}
                    theme={ButtonTheme.promoted}/>
        </div>
    </div>
}