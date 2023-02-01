import {Page} from "./Page";
import {
    Button,
    ButtonTheme,
    dateAdd,
    dateToDdd,
    dateToDdMmm,
    dateToDdMmmYyyy,
    dateToHhMm,
    disabledColor,
    hhMmToDate,
    Input,
    isEmptyObject,
    isEmptyText,
    pageColor,
    red,
    RouteProps,
    StoreValue,
    useAppContext,
    useProfile,
    useStore,
    Value,
    ValueOnChangeProperties
} from "@restaroo/lib";
import {useEffect, useMemo} from "react";
import {motion} from "framer-motion";
import produce from "immer";
import {IoSaveOutline} from "react-icons/io5";
import {SlideDetail} from "./SlideDetail";


const THIRTY_MINUTES = 1000 * 60 * 30;

interface Reservation {
    dateTime: Date,
    people: number,
    seatingPreferences: string,
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNo: string,
    updateOnWhatsapp: boolean
}

function DateSelector(props: ValueOnChangeProperties<Date>) {
    const {value, onChange} = props;

    return <div style={{
        display: 'flex',
        overflowY: 'hidden',
        overflowX: 'auto',
        paddingBottom: 20
    }}>
        {Array.from({length: 8}).map((_, index) => {
            const date = dateAdd(new Date()).date(index);

            const isSelected = dateToDdMmmYyyy(date) === dateToDdMmmYyyy(value);

            const label = index < 2 ? ['Today', 'Tomorrow'][index] : dateToDdd(date);
            return <motion.div style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(0,0,0,0.1)',
                padding: '10px 30px',
                marginRight: 10,
                alignItems: 'center',
                backgroundColor: isSelected ? red : pageColor,
                color: isSelected ? pageColor : 'unset'
            }} key={index} whileTap={{scale: 0.95}} onTap={() => onChange ? onChange(date) : ''}>
                <div style={{marginBottom: 3}}>{label}</div>
                <div style={{
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold',
                    fontSize: 14
                }}>{dateToDdMmm(date)}</div>
            </motion.div>
        })}
    </div>;
}

function TimeSelector(props: ({ openingTime: string, closingTime: string } & ValueOnChangeProperties<Date>)) {
    const {openingTime, closingTime, value, onChange} = props;

    const times: Date[] = useMemo(() => {
        const startTime = hhMmToDate(openingTime);
        const endTime = hhMmToDate(closingTime);

        if (startTime && endTime) {
            const difference = endTime?.getTime() - startTime?.getTime();
            const steps = Math.round(difference / THIRTY_MINUTES);
            const times = Array.from({length: steps}).map((_, index) => {
                return dateAdd(startTime).minute(30 * index);
            });
            return times;
        }
        return [];
    }, [openingTime, closingTime]);
    return <div style={{
        display: 'flex',
        overflowY: 'hidden',
        overflowX: 'auto',
        paddingBottom: 20
    }}>
        {times.map((time, index) => {
            const isSelected = dateToHhMm(time) === dateToHhMm(value);
            return <motion.div style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(0,0,0,0.1)',
                padding: '20px 30px',
                marginRight: 10,
                alignItems: 'center',
                backgroundColor: isSelected ? red : pageColor,
                color: isSelected ? pageColor : 'unset'
            }} key={index} whileTap={{scale: 0.95}} onTap={() => onChange ? onChange(time) : ''}>
                <div style={{fontSize: 16}}>{dateToHhMm(time)}</div>
            </motion.div>
        })}
    </div>;
}

function NumberOfPeopleSelector(props: ValueOnChangeProperties<number>) {
    const {value, onChange} = props;
    return <div style={{
        display: 'flex',
        overflowY: 'hidden',
        overflowX: 'auto',
        paddingBottom: 20
    }}>
        {Array.from({length: 21}).map((_, index) => {
            const total = index + 1;
            const isSelected = total === value;
            return <motion.div style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(0,0,0,0.1)',
                padding: '20px 30px',
                marginRight: 10,
                alignItems: 'center',
                backgroundColor: isSelected ? red : pageColor,
                color: isSelected ? pageColor : 'unset'
            }} key={index} whileTap={{scale: 0.95}} onTap={() => onChange ? onChange(total) : ''}>
                <div style={{fontSize: 16}}>{total}</div>
            </motion.div>
        })}
    </div>;
}

function PersonalDetailForm(props: {
    closePanel: (result: any) => void,
    firstName: string, lastName: string, email: string, phoneNo: string
}) {
    const {firstName, lastName, phoneNo, email, closePanel} = props;
    const store = useStore({
        firstName,
        lastName,
        phoneNo,
        email,
        errors: {firstName: '', lastName: '', phoneNo: '', email: ''}
    });
    const validate = () => {
        store.set(produce(s => {
            s.errors.email = isEmptyText(s.email) ? 'Email is required' : '';
            s.errors.phoneNo = isEmptyText(s.phoneNo) ? 'Phone is required' : '';
            s.errors.firstName = isEmptyText(s.firstName) ? 'First name is required' : '';
            s.errors.lastName = isEmptyText(s.lastName) ? 'Last name is required' : '';
        }));
        return isEmptyObject(store.get().errors);
    }
    return <SlideDetail closePanel={closePanel}>
        <StoreValue store={store} selector={s => [s.firstName, s.errors.firstName]} property={['value', 'error']}>
            <Input title={'First name'} placeholder={'enter your first name'}
                   onChange={(e) => {
                       store.set(produce(s => {
                           s.firstName = e.target.value;
                           s.errors.firstName = '';
                       }));
                   }} style={{inputStyle: {fontSize: 14}, titleStyle: {fontSize: 13}}}/>
        </StoreValue>
        <StoreValue store={store} selector={s => [s.lastName, s.errors.lastName]} property={['value', 'error']}>
            <Input title={'Last name'} placeholder={'enter your first name'}
                   onChange={(e) => {
                       store.set(produce(s => {
                           s.lastName = e.target.value;
                           s.errors.lastName = '';
                       }));
                   }} style={{inputStyle: {fontSize: 14}, titleStyle: {fontSize: 13}}}/>
        </StoreValue>
        <StoreValue store={store} selector={s => [s.email, s.errors.email]} property={['value', 'error']}>
            <Input title={'Email'} placeholder={'enter your email'} onChange={(e) => {
                store.set(produce(s => {
                    s.email = e.target.value;
                    s.errors.email = '';
                }));
            }} style={{inputStyle: {fontSize: 14}, titleStyle: {fontSize: 13}}}/>
        </StoreValue>
        <StoreValue store={store} selector={s => [s.phoneNo, s.errors.phoneNo]} property={['value', 'error']}>
            <Input title={'Phone'} placeholder={'enter your phone number'} onChange={(e) => {
                store.set(produce(s => {
                    s.phoneNo = e.target.value;
                    s.errors.phoneNo = '';
                }));
            }} style={{inputStyle: {fontSize: 14}, titleStyle: {fontSize: 13}}}/>
        </StoreValue>
        <Button onTap={() => {
            if (validate()) {
                const data = {
                    firstName: store.get().firstName,
                    lastName: store.get().lastName,
                    phoneNo: store.get().phoneNo,
                    email: store.get().email,
                };
                props.closePanel(data);
            }
        }} title={'Save Changes'} icon={IoSaveOutline} theme={ButtonTheme.danger}/>
    </SlideDetail>;
}

function Switch(props: ValueOnChangeProperties<boolean>) {
    let {value, onChange} = props;
    value = value === true;
    return <div style={{width: 40, display: 'flex', flexDirection: 'column'}}>
        <motion.div style={{
            display: 'flex',
            flexDirection: !value ? 'row' : 'row-reverse',
            width: 40,
            borderRadius: 20,
            height: 20,
            border: '1px solid rgba(0,0,0,0.1)'
        }} onTap={() => {
            if (onChange !== undefined) {
                onChange(!value)
            }
        }}>
            <motion.div layout style={{
                width: 20,
                height: 20,
                background: value === true ? red : disabledColor,
                borderRadius: 10
            }}>

            </motion.div>
        </motion.div>
    </div>;
}

export function ReservationPage(props: RouteProps) {

    const openingTime: string = '11:00';
    const closingTime: string = '24:00';
    const context = useAppContext();
    const nextAvailableTime = useMemo(() => {
        const time = new Date().getTime();
        return new Date((time - (time % THIRTY_MINUTES)) + THIRTY_MINUTES)
    }, []);
    const user = useProfile();

    const store = useStore<(Reservation & {
        errors: {
            people: string,
            seatingPreferences: string,
            firstName: string,
            lastName: string,
            phoneNo: string
        }
    })>({
        dateTime: nextAvailableTime,
        firstName: user.name,
        email: user.email,
        seatingPreferences: 'Indoor Seating, Non Smoking Area',
        people: 0,
        lastName: '',
        phoneNo: user.username,
        id: '',
        updateOnWhatsapp: true,
        errors: {
            firstName: '',
            lastName: '',
            people: '',
            phoneNo: '',
            seatingPreferences: ''
        }
    })
    useEffect(() => {
        store.set(produce(s => {
            s.firstName = user.name;
            s.email = user.email;
            s.phoneNo = user.username;
        }));
    }, [user, store])

    return <Page>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '15px 15px 65px 15px',
            overflow: 'auto'
        }}>
            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 10}}>
                <div style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>What Day ?</div>
                <StoreValue store={store} property={'value'} selector={s => s.dateTime}>
                    <DateSelector onChange={(date) => {
                        store.set(produce(s => {
                            s.dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), s.dateTime.getHours(), s.dateTime.getMinutes(), 0);
                        }));
                    }}/>
                </StoreValue>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 10}}>
                <div style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>How Many People ?</div>
                <StoreValue store={store} property={'value'} selector={s => s.people}>
                    <NumberOfPeopleSelector onChange={(value) => {
                        store.set(produce(s => {
                            s.people = value;
                        }));
                    }}/>
                </StoreValue>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 10}}>
                <div style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>What Time ?</div>
                <StoreValue store={store} property={'value'} selector={s => s.dateTime}>
                    <TimeSelector closingTime={closingTime} openingTime={openingTime} onChange={(time) => {
                        store.set(produce(s => {
                            s.dateTime = new Date(s.dateTime.getFullYear(), s.dateTime.getMonth(), s.dateTime.getDate(), time.getHours(), time.getMinutes(), 0);
                        }));
                    }}/>
                </StoreValue>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 20}}>
                <div style={{fontSize: 18, fontWeight: 'bold', marginBottom: 5}}>Seating Preferences ?</div>
                <div style={{display: 'flex'}}>
                    <div style={{flexGrow: 1, fontSize: 16}}>
                        <StoreValue store={store} property={'value'} selector={s => s.seatingPreferences}>
                            <Value/>
                        </StoreValue>
                    </div>
                    <motion.div style={{color: 'red', marginLeft: 10}} onTap={async () => {
                        const result = await context.showPicker({
                            picker: {
                                dataProvider: ['Indoor Seating, Non Smoking Area', 'Outdoor'],
                                dataToLabel: d => d,
                                dataToValue: v => v,
                                isValueBelongsToData: (value, data) => {
                                    debugger;
                                    return value === data;
                                },
                            }, value: store.get().seatingPreferences
                        });
                        store.set(produce(s => {
                            s.seatingPreferences = result;
                        }));
                    }} whileTap={{scale: 0.9}}>Change
                    </motion.div>
                </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 20}}>
                <div style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Personal Details</div>
                <div style={{display: 'flex'}}>
                    <div style={{display: 'flex', flexDirection: 'column', fontSize: 16, flexGrow: 1}}>
                        <StoreValue store={store} selector={s => `${s.firstName} ${s.lastName}, ${s.phoneNo}`}
                                    property={'value'}>
                            <Value/>
                        </StoreValue>
                        <StoreValue store={store} selector={s => `${s.email}`} property={'value'}>
                            <Value/>
                        </StoreValue>
                    </div>
                    <motion.div style={{color: 'red', marginLeft: 10}} onTap={async () => {
                        const result: any = await context.showSlidePanel(closePanel => {
                            return <PersonalDetailForm closePanel={closePanel}
                                                       firstName={store.get().firstName}
                                                       lastName={store.get().lastName}
                                                       phoneNo={store.get().phoneNo}
                                                       email={store.get().email}
                            />
                        });

                        store.set(old => ({...old, ...result}))

                    }} whileTap={{scale: 0.9}}>Change
                    </motion.div>
                </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: 20}}>
                    <div style={{flexGrow: 1}}>Receive booking updates on SMS</div>
                    <StoreValue store={store} selector={s => s.updateOnWhatsapp === true} property={'value'}>
                        <Switch onChange={value => {
                            store.set(produce(s => {
                                s.updateOnWhatsapp = value;
                            }));
                        }}/>
                    </StoreValue>

                </div>

                <Button onTap={() => {
                }} title={<div style={{display: 'flex', flexDirection: 'column', fontSize: 12}}>
                    <div style={{fontSize: 14, fontWeight: 'bold'}}>Book Table</div>
                    <div>IT MAY TAKE UP TO 3 MINS</div>
                </div>} icon={IoSaveOutline} theme={ButtonTheme.danger} style={{padding: '5px 10px'}}
                        iconStyle={{fontSize: 25, marginTop: -5, marginLeft: 10}}/>
            </div>
        </div>

    </Page>
}


