import {motion} from "framer-motion";
import {IoChevronBackOutline} from "react-icons/io5";
import {
    CSSProperties,
    forwardRef,
    PropsWithChildren,
    ReactFragment,
    useId,
    useImperativeHandle
} from "react";
import {useAppContext} from "../useAppContext";
import invariant from "tiny-invariant";

type Element = string | number | boolean | ReactFragment | JSX.Element | null | undefined;

export const Header = forwardRef(function Header(props: PropsWithChildren<{ title: Element, size?: 'small' | 'big', floating?: boolean }>,ref) {
    const compId = useId();
    let {title, size, floating} = props;
    size = size ?? 'small';
    const style: CSSProperties = {display: 'flex', flexDirection: 'column', padding: '0px 0px'};
    const {appDimension} = useAppContext();

    if (floating === true) {
        style.position = 'absolute';
        style.top = 0;
        style.left = 0;
        style.width = appDimension.width;
        style.backdropFilter = 'blur(10px)';
        style.WebkitBackdropFilter = 'blur(10px)';
    }
    useImperativeHandle(ref,() => {
        return {
            showShadow : (showShadow:boolean) => {
                const container = document.getElementById(compId);
                invariant(container);
                container.style.boxShadow = showShadow ? '0 5px 5px -3px rgba(0,0,0,0.1)' : 'unset';
                container.style.backgroundColor = showShadow ? 'rgba(255,255,255,0.5)' : 'unset';
            }
        }
    })
    return <div style={style} id={compId}>
        <div style={{
            display: 'flex',
            alignItems: 'center'
        }}>
            <motion.div onClick={() => {
                window.history.back()
            }}
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}} style={{padding: 5}}>
                <IoChevronBackOutline style={{fontSize: 25}}/>
            </motion.div>
            {size === 'small' &&
                <div style={{display: 'flex', flexGrow: 1}}>
                    <div style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        lineHeight: 1,
                        marginBottom: 2,
                        marginLeft: 10,
                        flexShrink: 0
                    }}>{title}</div>
                    <div style={{display: 'flex', flexGrow: 1, flexDirection: 'column'}}>
                        {props.children}
                    </div>
                </div>
            }
        </div>
        {size === 'big' &&
            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                <div style={{
                    fontSize: 25,
                    lineHeight: 1,
                    marginTop: 10,
                    marginLeft: 10,
                    flexShrink: 0
                }}>{title}</div>
                <div style={{display: 'flex', flexGrow: 1, flexDirection: 'column'}}>
                    {props.children}
                </div>
            </div>
        }
    </div>
})