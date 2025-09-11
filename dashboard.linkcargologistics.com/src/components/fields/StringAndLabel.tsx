import { ReactNode } from 'react';
type Props = {
    children: ReactNode;
    className?:string|undefined;
    label?:string|undefined;
    error?:string|undefined;
};
const StringAndLabel=({ children , className, label, error}: Props)=>{
    return  <div className={className||""}>
                {
                    label&&(
                        <label>
                            <b>{label}</b>
                        </label>
                    )
                }
                
                <div>
                    {children}
                </div>
                {
                    error&&(
                        <div className='text-red-400 text-xs'>
                            {error}
                        </div>
                    )
                }
            </div>
}
export default StringAndLabel;