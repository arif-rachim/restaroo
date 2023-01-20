import {ReactElement, useEffect, useId, useMemo, useRef} from "react";
import invariant from "tiny-invariant";
import noNull from "../../utils/noNull";

export interface KeyValue {
    key: number,
    value: string | ReactElement,
}

const ROW_HEIGHT = 50;
const VISIBLE_ROW = 7;

export function Picker(props: { value?: number, onChange?: (param: number) => void, data: KeyValue[], width?: number | string, fontSize?: number | string,onRowClick?:(index:number) => void}) {
    const {value, data, width, onChange, fontSize,onRowClick} = props;
    const compKey = useId();
    const visibleRow = data.length < 3 ? 3 : data.length < 5 ? 5 : 7;

    useEffect(() => {
        const component = document.getElementById(`${compKey}component`);
        invariant(component);
        const val = noNull(value, 0);
        const needToReAlign = Math.abs((val * ROW_HEIGHT) - component.scrollTop) > ROW_HEIGHT || component.scrollTop === 0;
        if (needToReAlign) {
            updateAnimation(compKey, noNull(value, 0), 0);
            component.scrollTop = ROW_HEIGHT * (noNull(value, 0));
        }
    }, [compKey, value]);
    const HALF_ROW = (visibleRow - 1) / 2;
    return <div style={{
        height: ROW_HEIGHT * visibleRow,
        overflow: 'auto',
        position: 'relative',
        scrollSnapType: 'y mandatory',
        boxSizing: 'border-box',
        width: width,
        overflowX: 'hidden'
    }} onScroll={(event) => {
        const fromTop = (event.target as HTMLDivElement).scrollTop;
        const selectedIndex = Math.floor(fromTop / ROW_HEIGHT);
        const ratio = (fromTop % ROW_HEIGHT) / ROW_HEIGHT;
        updateAnimation(compKey, selectedIndex, ratio);
        if (onChange) {
            onChange(selectedIndex);
        }
    }} id={`${compKey}component`}>
        {Array.from({length: HALF_ROW}).map((_, index) => {
            return <div style={{height: ROW_HEIGHT, scrollSnapAlign: 'start', boxSizing: 'border-box'}}
                        key={'empty-start-' + index}/>
        })}
        {data.map((item, index) => {

            return <div key={index} style={{
                fontSize: noNull(fontSize, 35),
                border: '1px solid rgba(0,0,0,0)',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0px 5px',
                boxSizing: 'border-box',
                display: 'flex',
                height: ROW_HEIGHT,
                scrollSnapAlign: 'start'
            }} id={`${compKey}container`} onClick={() => {
                if (onRowClick) {
                    onRowClick(index);
                }
            }}>
                <div id={`${compKey}${item.key}`}>{item.value}</div>
            </div>
        })}
        {Array.from({length: HALF_ROW}).map((_, index) => {
            return <div style={{height: ROW_HEIGHT, scrollSnapAlign: 'start', boxSizing: 'border-box'}}
                        key={'empty-end-' + index}/>
        })}
    </div>;
}


function updateAnimation(compKey: string, selectedIndex: number, movementPercentage: number) {
    const step = 0.2;
    const halfList = (VISIBLE_ROW - 1) / 2;
    [0].map(val => document.getElementById(`${compKey}${selectedIndex + val}`)).forEach(element => {
        if (element === null) {
            return;
        }
        const scale = 1 - (step * movementPercentage);
        element.style.transform = `scale(${scale})`;
        element.style.opacity = `${scale}`;
    });
    Array.from({length: (halfList + 2)}).map((_, index) => {
        index = index + 1;
        return [-index, index]
    }).forEach(value => {
        value.map(val => ({
            element: document.getElementById(`${compKey}${selectedIndex + val}`),
            index: val
        })).forEach(({element, index}) => {
            if (element === null) {
                return;
            }
            const absValIndex = Math.abs(index);
            if (index < 0) {
                const scale = (1 - (step * absValIndex)) - (step * movementPercentage);
                element.style.transform = `scale(${scale})`;
                element.style.opacity = `${scale}`;

            } else {
                const scale = (1 - (step * absValIndex)) + (step * movementPercentage);
                element.style.transform = `scale(${scale})`;
                element.style.opacity = `${scale}`;
            }
        });
    });
}