import { useState, useEffect } from 'react';
import useFormData from '@/hooks/useFormDataNew';

interface Step {
  step: number;
  name: string;
  note: string;
}

interface ChecklistProps {
  steps: Step[];
  productionOrderId: any;
  onUpdateChecklist: (step: number) => void;
  onAddComment: (step: number, comment: string, productionOrderId: string) => void;
  completedSteps: number[];
  commentsData: Record<string, any[]>;
}

let formData: any;

const ChecklistComponent = ({ steps, productionOrderId, onUpdateChecklist, onAddComment, completedSteps, commentsData }: ChecklistProps) => {
    formData = useFormData(false, false, false);

    const [comments, setComments] = useState<{ [key: number]: string }>({});
    const [checkedSteps, setCheckedSteps] = useState<number[]>(completedSteps);

    useEffect(() => {
        setCheckedSteps(completedSteps);
    }, [completedSteps]);

    useEffect(() => {
        const initialComments: { [key: number]: string } = {};
        steps.forEach((step) => {
            initialComments[step.step] = '';
        });
        setComments(initialComments);
    }, [steps]);

    const handleCheckboxChange = (step: number) => {
        onUpdateChecklist(step);
        setCheckedSteps([...checkedSteps, step]);

        formData.handleRequest(formData.backend + "/dashboard/production-order/order-updateChecklist", "post", { step, production_order_id: productionOrderId })
            .then((response: any) => {
                console.log(response);
            });
    };

    const handleCommentChange = (step: number, comment: string) => {
        setComments((prevComments) => ({
            ...prevComments,
            [step]: comment,
        }));
    };

    const handleCommentSubmit = (step: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && comments[step]) {
            onAddComment(step, comments[step], productionOrderId);
            setComments((prev) => ({
                ...prev,
                [step]: '',
            }));
        }
    };

    return (
        <div className="">
            <h6 className='mb-2'><b>Checklist</b></h6>
            <form>
                <div className="grid grid-cols-1 gap-4">
                    {steps.map((step, index) => {
                        const isStepAccessible = index === 0 || checkedSteps.includes(steps[index - 1].step);
                        return (
                            <div key={index} className="col-span-1">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        id={`step${step.step}`}
                                        checked={checkedSteps.includes(step.step)}
                                        onChange={() => handleCheckboxChange(step.step)}
                                        disabled={!isStepAccessible || checkedSteps.includes(step.step)}
                                    />
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor={`step${step.step}`}
                                    >
                                        {step.name}
                                    </label>
                                </div>
                                <div className='pl-8'>
                                    <input
                                        type="text"
                                        className="mt-2 w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2"
                                        placeholder={`Comentario ${step.name}`}
                                        value={comments[step.step] || ''}
                                        onChange={(e) => handleCommentChange(step.step, e.target.value)}
                                        onKeyPress={(e) => handleCommentSubmit(step.step, e)}
                                        disabled={!isStepAccessible || checkedSteps.includes(step.step)}
                                    />
                                </div>
                                {commentsData[`step${step.step}`] && (
                                    <div className="pl-8 mt-2">
                                        {commentsData[`step${step.step}`].map((comment: any, i: number) => (
                                            <div key={i} className="text-xs text-gray-600 bg-gray-200 p-2 rounded-md mb-1">
                                                {comment.note}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </form>
        </div>
    );
};

export default ChecklistComponent;
