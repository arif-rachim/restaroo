import {StoreValue, useStore} from "../store/useStore";
import {PropsWithChildren, useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import invariant from "tiny-invariant";
import {Button} from "./Button";
import {IoCalendar} from "react-icons/io5";
import {ButtonTheme} from "../../routes/Theme";

export function InputModal() {
    const [date,setDate] = useState(new Date())
    return <div style={{
        height: '100%',
        background: 'rgba(0,0,0,0.8)',
        position: 'absolute',
        top: 0,
        width: '100%',
        overflow: 'hidden'
    }}>
        <Calendar value={date} onChange={(val) => setDate(val)}/>
    </div>
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augustus', 'September', 'October', 'November', 'December'];

const currentYear = new Date().getFullYear();

function toCalendarFormat(value: Date) {
    debugger;
    const day = value.getDate() - 1;
    const month = value.getMonth();
    const year = currentYear - value.getFullYear();
    return {day, month, year};
}

function toDateFormat(props: { day: number, month: number, year: number }) {
    const date = new Date(props.day + 1, props.month, currentYear - props.year);
    return date;
}

function Calendar(props: { value: Date, onChange: (value: Date) => void }) {

    const dayDomRef = useRef<HTMLDivElement>(null);
    const monthDomRef = useRef<HTMLDivElement>(null);
    const yearDomRef = useRef<HTMLDivElement>(null);
    const {value, onChange} = props;
    const store = useStore(() => {
        return toCalendarFormat(value)
    });
    useEffect(() => {
        const newState = toCalendarFormat(value);
        invariant(dayDomRef.current);
        invariant(monthDomRef.current);
        invariant(yearDomRef.current);
        dayDomRef.current.scrollTop = newState.day * 50;
        monthDomRef.current.scrollTop = newState.month * 50;
        yearDomRef.current.scrollTop = newState.year * 50;
        store.setState(newState);
    }, [value,store]);
    return <div style={{
        display: 'flex', flexDirection: 'column', bottom: 0,
        position: 'absolute',
        width: '100%',
        backgroundColor: 'white'
    }}>
        <div style={{display: 'flex', flexDirection: 'column', padding: 5}}>
            <Button title={'OK'} onTap={() => onChange(toDateFormat(store.stateRef.current))} icon={IoCalendar}
                    theme={ButtonTheme.promoted}/>
        </div>
        <div style={{
            display: 'flex',
            height: 350,
            justifyContent: 'center'
        }}>
            <div style={{
                height: '100%',
                overflow: 'auto',
                position: 'relative',
                scrollSnapType: 'y mandatory',
                boxSizing: 'border-box',
                width: 70,
                overflowX: 'hidden'
            }} onScroll={(event) => {
                const fromTop = (event.target as HTMLDivElement).scrollTop;
                store.setState(old => ({...old, day: Math.ceil(fromTop / 50)}));
            }} ref={dayDomRef}>
                {Array.from({length: 3}).map((_, index) => {
                    return <div style={{height: 50, scrollSnapAlign: 'start'}} key={'empty-start-' + index}/>
                })}
                {Array.from({length: 31}).map((_, index) => {
                    const day = index + 1;
                    return <div key={index} style={{
                        fontSize: 35,
                        border: '1px solid rgba(0,0,0,0)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '0px 5px',
                        boxSizing: 'border-box',
                        height: 50,
                        scrollSnapAlign: 'end'
                    }}>
                        <StoreValue store={store} property={'level'}
                                    selector={(s) => 0.3 + (0.7 / (Math.abs(s.day - index) + 1))}>
                            <FocusLevel level={1} position={'left'}>
                                <div style={{marginTop: -5}}>{day}</div>
                            </FocusLevel>
                        </StoreValue>
                    </div>
                })}
                {Array.from({length: 3}).map((_, index) => {
                    return <div style={{height: 50, scrollSnapAlign: 'start'}} key={'empty-end-' + index}/>
                })}
            </div>
            <div style={{
                height: '100%',
                overflow: 'auto',
                position: 'relative',
                scrollSnapType: 'y mandatory',
                boxSizing: 'border-box',
                overflowX: 'hidden'
            }} onScroll={(event) => {
                const fromTop = (event.target as HTMLDivElement).scrollTop;
                store.setState(old => ({...old, month: Math.ceil(fromTop / 50)}));
            }} ref={monthDomRef}>
                {Array.from({length: 3}).map((_, index) => {
                    return <div style={{height: 50, scrollSnapAlign: 'start'}} key={'empty-start-' + index}/>
                })}
                {months.map((month, index) => {
                    return <div key={index} style={{
                        fontSize: 35,
                        border: '1px solid rgba(0,0,0,0)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '0px 5px',
                        boxSizing: 'border-box',
                        height: 50,
                        scrollSnapAlign: 'start'
                    }}>
                        <StoreValue store={store} property={'level'}
                                    selector={(s) => 0.3 + (0.7 / (Math.abs(s.month - index) + 1))}>
                            <FocusLevel level={1} position={'center'}>
                                <div style={{marginTop: -5}}>{month}</div>
                            </FocusLevel>
                        </StoreValue>

                    </div>
                })}

                {Array.from({length: 3}).map((_, index) => {
                    return <div style={{height: 50, scrollSnapAlign: 'start'}} key={'empty-end-' + index}/>
                })}
            </div>
            <div style={{
                height: '100%',
                overflow: 'auto',
                position: 'relative',
                overflowX: 'hidden',
                scrollSnapType: 'y mandatory',
                boxSizing: 'border-box',

            }} onScroll={(event) => {
                const fromTop = (event.target as HTMLDivElement).scrollTop;
                store.setState(old => ({...old, year: Math.ceil(fromTop / 50)}));
            }} ref={yearDomRef}>
                {Array.from({length: 3}).map((_, index) => {
                    return <div style={{height: 50, scrollSnapAlign: 'start'}} key={'empty-start-' + index}/>
                })}
                {Array.from({length: 80}).map((month, index) => {
                    const year = currentYear - index;
                    return <div key={index} style={{
                        fontSize: 35,
                        border: '1px solid rgba(0,0,0,0)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                        height: 50,
                        scrollSnapAlign: 'start'
                    }}>
                        <StoreValue store={store} property={'level'}
                                    selector={(s) => 0.3 + (0.7 / (Math.abs(s.year - index) + 1))}>
                            <FocusLevel level={1} position={'right'}>
                                <div style={{marginTop: -5}}>{year}</div>
                            </FocusLevel>
                        </StoreValue></div>
                })}
                {Array.from({length: 3}).map((_, index) => {
                    return <div style={{height: 50, scrollSnapAlign: 'start'}} key={'empty-end-' + index}/>
                })}
            </div>
        </div>
    </div>
}

function FocusLevel(props: PropsWithChildren<{ level: number, position: 'left' | 'center' | 'right' }>) {
    const level = props.level;
    let x = 0;
    if (props.position === 'left') {
        x = ((1 / level) - 1) * 15;
    }
    if (props.position === 'right') {
        x = -((1 / level) - 1) * 15;
    }
    return <motion.div animate={{scale: level, opacity: level, x}}>{props.children}</motion.div>
}