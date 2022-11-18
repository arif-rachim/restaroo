import {useEffect, useId} from "react";
import invariant from "tiny-invariant";

export interface KeyValue {
    key: number,
    value: string,
}

const ROW_HEIGHT = 50;
const VISIBLE_ROW = 7;

export function Picker(props: { value?: number, onChange?: (param: number) => void, data: KeyValue[], width?: number | string }) {
    const {value, data, width, onChange} = props;
    const compKey = useId();

    useEffect(() => {
        const component = document.getElementById(`${compKey}component`);
        invariant(component);
        const val = value ?? 0;
        const needToReAlign = Math.abs((val * ROW_HEIGHT) - component.scrollTop) > ROW_HEIGHT || component.scrollTop === 0;
        if (needToReAlign) {
            updateAnimation(compKey, value ?? 0, 0);
            component.scrollTop = ROW_HEIGHT * (value ?? 0);
        }
    }, [compKey, value]);
    const HALF_ROW = (VISIBLE_ROW - 1) / 2;
    return <div style={{
        height: ROW_HEIGHT * VISIBLE_ROW,
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
    const calculateStyle = (scale: number) => `transform : scale(${scale});opacity : ${scale}`;
    const step = 0.2;
    const halfList = (VISIBLE_ROW - 1) / 2;
    [0].map(val => document.getElementById(`${compKey}${selectedIndex + val}`)).forEach(element => {
        if (element === null) {
            return;
        }
        element.setAttribute('style', calculateStyle(1 - (step * movementPercentage)));
    });
    Array.from({length: (halfList + 1)}).map((_, index) => {
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
                element.setAttribute('style', calculateStyle((1 - (step * absValIndex)) - (step * movementPercentage)));
            } else {
                element.setAttribute('style', calculateStyle((1 - (step * absValIndex)) + (step * movementPercentage)));
            }
        });
    });
}