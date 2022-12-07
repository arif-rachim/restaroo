import {CSSProperties, ForwardedRef, forwardRef, PropsWithChildren, ReactElement, useEffect, useId} from "react";
import {IconType} from "react-icons";
import {IoChevronForward} from "react-icons/io5";
import invariant from "tiny-invariant";
import {motion} from "framer-motion";

export const Card = forwardRef(function Card(props: PropsWithChildren<{ style?: CSSProperties }>, ref: ForwardedRef<HTMLDivElement>) {
    const style = props.style ?? {};
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: '10px 0px',
        borderRadius: 13,
        boxShadow: '0 3px 10px -3px rgba(0,0,0,0.06)',
        ...style
    }} ref={ref}>
        {props.children}
    </div>
})

export function CardRow(props: { icon: IconType, title: string | ReactElement, onTap?: () => void }) {
    const {icon: Icon, title, onTap} = props;
    return <motion.div style={{display: 'flex', alignItems: 'center', margin: '0px 0px 10px 0px'}} whileTap={{scale: 0.95}}
                       onTap={onTap} >
        <div style={{fontSize: 30, marginLeft: 20}}>
            <Icon/>
        </div>
        <div style={{fontSize: 16, marginBottom: 3, marginLeft: 10, flexGrow: 1, position: 'relative', display: 'flex'}}>
            <div style={{flexGrow: 1}}>
                {title}
            </div>
            <div style={{marginRight: 10}}>
                <IoChevronForward/>
            </div>
            <div style={{position: 'absolute', bottom: -15, width: '100%', borderBottom: '1px solid rgba(0,0,0,0.1)'}}/>
        </div>
    </motion.div>;
}




export function CardTitle(props: { title?: string, onMounted?: (params: { title: string, dimension: DOMRect }) => () => void }) {
    const {title, onMounted} = props;
    const id = useId();
    useEffect(() => {
        if (!onMounted) {
            return () => {
            };
        }
        const dom = document.getElementById(id);
        invariant(dom);
        let unMount: any = undefined;
        setTimeout(() => {
            const dimension = dom.getBoundingClientRect();
            unMount = onMounted({
                title: title ?? '',
                dimension
            });
        }, 300);

        return () => {
            if (unMount) {
                unMount();
            }
        }
        // eslint-disable-next-line
    }, [])
    return <div style={{display: 'flex', margin: '10px 0px'}} id={id}>
        <div style={{
            background: 'red',
            width: 3,
            marginRight: 10,
            borderTopRightRadius: 3,
            borderBottomRightRadius: 3
        }}/>
        <div style={{fontWeight: 'bold', fontSize: 16}}>{title}</div>
    </div>;
}