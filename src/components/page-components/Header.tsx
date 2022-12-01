import {motion} from "framer-motion";
import {IoChevronBackOutline} from "react-icons/io5";
import {PropsWithChildren, ReactFragment} from "react";


type Element = string | number | boolean | ReactFragment | JSX.Element | null | undefined;

export function Header(props: PropsWithChildren<{ title: Element, size?: 'small' | 'big' }>) {
    let {title, size} = props;
    size = size ?? 'small';
    return <div style={{display: 'flex', flexDirection: 'column', padding: '0px 0px'}}>
        <div style={{
            display: 'flex',
            alignItems: 'center'
        }}>
            <motion.div onClick={() => {
                window.history.back()
            }}
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}} style={{padding:5}}>
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
                        flexShrink:0
                    }}>{title}</div>
                    <div style={{display:'flex',flexGrow:1,flexDirection:'column'}}>
                    {props.children}
                    </div>
                </div>
            }
        </div>
        {size === 'big' &&
            <div style={{display: 'flex',flexDirection:'column', flexGrow: 1}}>
                <div style={{
                    fontSize: 25,
                    lineHeight: 1,
                    marginTop: 10,
                    marginLeft: 10,
                    flexShrink:0
                }}>{title}</div>
                <div style={{display:'flex',flexGrow:1,flexDirection:'column'}}>
                    {props.children}
                </div>
            </div>
        }
    </div>
}