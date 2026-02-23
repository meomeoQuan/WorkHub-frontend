import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import type { PaymentPlan } from '../contexts/AuthContext';
import type { ApiResponse } from '../types/ApiResponse';

export function PaymentResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { upgradePlan } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'cancelled' | 'error'>('loading');
    const [message, setMessage] = useState('');

    const orderCode = searchParams.get('orderCode');
    const cancel = searchParams.get('cancel');

    useEffect(() => {
        const processPayment = async () => {
            if (!orderCode) {
                setStatus('error');
                setMessage('Không tìm thấy mã đơn hàng');
                return;
            }

            const isCancelled = cancel === 'true';
            const endpoint = isCancelled ? 'cancel-payment' : 'return-payment';

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/PayOs/${endpoint}?orderCode=${orderCode}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                        }
                    }
                );
                const data: ApiResponse<any> = await response.json();

                if (data.success) {
                    setStatus(isCancelled ? 'cancelled' : 'success');
                    setMessage(
                        isCancelled
                            ? 'Thanh toán đã bị huỷ.'
                            : 'Thanh toán thành công! Gói của bạn đã được nâng cấp.'
                    );

                    // Update plan in AuthContext on success
                    if (!isCancelled && data.data?.plan) {
                        upgradePlan(data.data.plan as PaymentPlan);
                    }
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Đã xảy ra lỗi khi xử lý thanh toán');
                }
            } catch {
                setStatus('error');
                setMessage('Không thể kết nối tới máy chủ');
            }
        };

        processPayment();
    }, [orderCode, cancel]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 text-[#FF9800] animate-spin mx-auto" />
                        <h2 className="text-xl font-semibold text-[#263238]">Đang xử lý thanh toán...</h2>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#263238]">Thanh toán thành công!</h2>
                        <p className="text-[#263238]/70">{message}</p>
                    </>
                )}

                {status === 'cancelled' && (
                    <>
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                            <XCircle className="w-12 h-12 text-orange-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#263238]">Thanh toán đã huỷ</h2>
                        <p className="text-[#263238]/70">{message}</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <XCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#263238]">Có lỗi xảy ra</h2>
                        <p className="text-[#263238]/70">{message}</p>
                    </>
                )}

                {status !== 'loading' && (
                    <div className="flex gap-3 justify-center pt-4">
                        <Button
                            onClick={() => navigate('/pricing')}
                            variant="outline"
                            className="rounded-xl"
                        >
                            Xem Bảng Giá
                        </Button>
                        <Button
                            onClick={() => navigate('/jobs')}
                            className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl"
                        >
                            Tìm Việc Làm
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
