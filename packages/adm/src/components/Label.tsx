import {CSSProperties, useState} from "react";
import {useAppContext, useAppStore, useAsyncEffect, useStoreValue} from "@restaroo/lib";
import {AppState} from "../index";
import {IoCreate} from "react-icons/io5";
import {motion} from "framer-motion";

export function Label(props: ({ label: string, style: CSSProperties })) {
    const appStore = useAppStore<AppState>();
    const {label, style} = props;
    let locale = useStoreValue(appStore, s => s.locale, []) ?? 'en-us';
    let activateComponentEditor = useStoreValue(appStore, s => s.activateComponentEditor, []);

    const {pb} = useAppContext();
    const [state, setState] = useState(label);
    const [onHover, setOnHover] = useState(false);
    useAsyncEffect(async () => {
        const item = await pb.collection('system_i18n').getFirstListItem(`fieldId="${label}" && locale="${locale}"`, {});
        if (item) {
            setState(item.label);
        }
    }, [])

    return <motion.div style={{display: 'flex', flexDirection: 'column', position: 'relative', ...style}}
                       onHoverStart={() => {
                           setOnHover(true)
                       }}
                       onHoverEnd={() => {
                           setOnHover(false)
                       }}
    >{state}
        <motion.div style={{position: 'absolute', top: 0, right: 0, opacity: 0,cursor:'pointer'}} animate={{opacity: onHover ? 1 : 0}}
                    onTap={() => {
                        // WE NEED TO SHOW THE DIALOG TO EDIT THE SHIT !!
                    }}>
            <IoCreate/>
        </motion.div>
    </motion.div>
}