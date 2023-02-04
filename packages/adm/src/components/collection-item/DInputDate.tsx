import {DateSchema} from "@restaroo/mdl";
import {dateToDdMmmYyyy, dateToHhMm, PickerOptions, Store} from "@restaroo/lib";
import {DInput} from "../DInput";
import produce from "immer";

export function DInputDate<T>(props: { schema: DateSchema, date: Date, store: Store<any>, showPicker: <T>(props: { picker: PickerOptions; value: T }) => Promise<T> }) {
    const {store, showPicker, date, schema} = props;
    return <DInput title={<DInput title={`${schema.name} : `}
                                  titlePosition={'left'}
                                  titleWidth={120}
                                  placeholder={`Please enter ${schema.name}`}
                                  style={{
                                      titleStyle: {
                                          padding: 0,
                                          margin: '0px 10px 0px 0px',
                                          justifyContent: 'flex-end',
                                          flexShrink: 0,
                                      },
                                      containerStyle: {
                                          padding: 0,
                                          margin: 0
                                      },
                                      errorStyle: {
                                          margin: 0,
                                          padding: 0,
                                          height: 0
                                      },
                                      inputStyle: {
                                          padding: 5
                                      }
                                  }}
                                  value={dateToDdMmmYyyy(date)}
                                  readOnly={true}
                                  onFocus={async () => {
                                      const val = store.get()[schema.name];
                                      const value = await showPicker({
                                          picker: 'date',
                                          value: val
                                      });
                                      store.set(produce((s: any) => {
                                          s[schema.name] = value;
                                      }))
                                  }}/>} titlePosition={'left'}

                   placeholder={''}
                   titleWidth={250}
                   value={dateToHhMm(date)}
                   style={{
                       titleStyle: {
                           paddingLeft: 0,
                           paddingBottom: 0,
                           margin: '0px 10px 0px 0px',
                           justifyContent: 'flex-end',
                           flexShrink: 0
                       },
                       containerStyle: {
                           alignItems: 'flex-start'
                       },
                       inputStyle: {
                           padding: '5px 5px'
                       }
                   }}
                   readOnly={true}
                   onFocus={async () => {
                       const val = store.get()[schema.name];
                       const value = await showPicker({
                           value: val,
                           picker: "time"
                       });
                       store.set(produce((s: any) => {
                           s[schema.name] = value;
                       }))
                   }}/>;
}