import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Check, Crown, Zap, Star, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import type { PaymentPlan } from '../types/User';
import type { ApiResponse } from '../types/ApiResponse';
import { toast } from 'sonner';

const plans = [
  {
    id: 'free' as PaymentPlan,
    name: 'Miễn Phí',
    price: '0₫',
    period: 'mãi mãi',
    description: 'Hoàn hảo để bắt đầu',
    icon: Zap,
    color: 'from-[#263238] to-[#37474F]',
    borderColor: 'border-[#263238]/20',
    features: [
      'Xem không giới hạn công việc',
      'Ứng tuyển 5 công việc mỗi tháng',
      'Hồ sơ cơ bản',
      'Thông báo qua email',
      'Hỗ trợ cộng đồng'
    ],
    limitations: [
      'Giới hạn lượt ứng tuyển',
      'Hiển thị tiêu chuẩn',
      'Chỉ tính năng cơ bản'
    ]
  },
  {
    id: 'silver' as PaymentPlan,
    name: 'Silver',
    price: '1.000₫',
    priceVND: 1000,
    period: 'mỗi tháng',
    description: 'Dành cho người tìm việc tích cực',
    icon: Crown,
    color: 'from-gray-400 to-gray-600',
    borderColor: 'border-gray-400',
    badge: 'Phổ Biến',
    features: [
      'Tất cả trong gói Miễn Phí',
      'Ứng tuyển 25 công việc mỗi tháng',
      'Hỗ trợ ưu tiên',
      'Hồ sơ nâng cao',
      'Theo dõi đơn ứng tuyển',
      'Thông báo việc làm',
      'Mẫu CV chuyên nghiệp'
    ]
  },
  {
    id: 'gold' as PaymentPlan,
    name: 'Gold',
    price: '2.000₫',
    priceVND: 2000,
    period: 'mỗi tháng',
    description: 'Dành cho chuyên gia nghiêm túc',
    icon: Star,
    color: 'from-yellow-400 to-yellow-600',
    borderColor: 'border-yellow-500',
    badge: 'Tốt Nhất',
    features: [
      'Tất cả trong gói Silver',
      'Ứng tuyển không giới hạn',
      'Hiển thị hồ sơ gấp 2 lần',
      'Huy hiệu hồ sơ nổi bật',
      'Phân tích nâng cao',
      'Gợi ý việc làm ưu tiên',
      'Nhắn tin trực tiếp nhà tuyển dụng',
      'Mẹo chuẩn bị phỏng vấn'
    ]
  }
];

export function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);

  const handleUpgrade = async (planId: PaymentPlan) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (planId === 'free') return;

    const plan = plans.find(p => p.id === planId);
    if (!plan || !('priceVND' in plan)) return;

    setSelectedPlan(planId);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/PayOs/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          totalAmount: (plan as any).priceVND,
          items: [
            {
              name: `Đăng ký gói ${plan.name}`,
              quantity: 1,
              price: (plan as any).priceVND
            }
          ]
        })
      });

      const data: ApiResponse<any> = await response.json();

      if (data.success && data.data?.checkoutUrl) {
        // Redirect to PayOS checkout page
        window.location.href = data.data.checkoutUrl;
      } else {
        const errorMsg = data.errors ? `${data.message}: ${data.errors}` : (data.message || 'Không thể tạo thanh toán');
        toast.error(errorMsg);
        setSelectedPlan(null);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Đã xảy ra lỗi khi tạo thanh toán');
      setSelectedPlan(null);
    }
  };

  const currentPlan = user?.paymentPlan || 'free';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FF9800] via-[#FF9800] to-[#FFC107] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Crown className="w-4 h-4 text-white" />
              <span className="text-sm text-white">Chọn Gói Của Bạn</span>
            </div>

            <h1 className="text-white mb-4 text-4xl md:text-5xl leading-tight">
              Thăng Tiến Sự Nghiệp
            </h1>

            <p className="text-xl text-white/95 mb-8">
              Mở khoá tính năng cao cấp và tìm việc mơ ước nhanh hơn
            </p>

            {user && (
              <div className="flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="text-white text-sm">
                    Gói hiện tại: <strong className="capitalize">{currentPlan === 'free' ? 'Miễn Phí' : currentPlan}</strong>
                  </span>
                </div>
                {user.subscription && user.subscription.plan !== 'free' && (
                  <div className="text-white/80 text-xs flex flex-col items-center gap-1">
                    <span className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${user.subscription.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                      {user.subscription.isActive ? 'Đang hoạt động' : 'Đã hết hạn'}
                    </span>
                    <span>Hết hạn ngày: {new Date(user.subscription.endAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = currentPlan === plan.id;
              const isUpgrade = plans.findIndex(p => p.id === currentPlan) < plans.findIndex(p => p.id === plan.id);
              const isProcessing = selectedPlan === plan.id;

              return (
                <Card
                  key={plan.id}
                  className={`relative p-6 border-2 ${plan.borderColor} hover:shadow-xl transition ${isCurrentPlan ? 'ring-2 ring-[#4ADE80]' : ''
                    }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF9800] text-white">
                      {plan.badge}
                    </Badge>
                  )}

                  {isCurrentPlan && (
                    <Badge className="absolute -top-3 right-4 bg-[#4ADE80] text-white">
                      Hiện tại
                    </Badge>
                  )}

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-[#263238] mb-2">{plan.name}</h3>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-[#263238]">{plan.price}</span>
                    <span className="text-sm text-[#263238]/60 ml-2">{plan.period}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#263238]/70 mb-6">{plan.description}</p>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrentPlan || isProcessing}
                    className={`w-full mb-6 rounded-xl ${isCurrentPlan
                      ? 'bg-[#4ADE80] hover:bg-[#4ADE80] cursor-not-allowed'
                      : isUpgrade
                        ? 'bg-gradient-to-r from-[#FF9800] to-[#4FC3F7] hover:from-[#F57C00] hover:to-[#4FC3F7] text-white'
                        : 'bg-[#263238]/10 hover:bg-[#263238]/20 text-[#263238]'
                      }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Đang xử lý...
                      </>
                    ) : isCurrentPlan ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Gói Hiện Tại
                      </>
                    ) : isUpgrade ? (
                      <>
                        Nâng Cấp Ngay
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      'Chọn Gói'
                    )}
                  </Button>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#4ADE80] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-[#263238]/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations (only for free plan) */}
                  {plan.limitations && (
                    <div className="mt-4 pt-4 border-t border-[#263238]/10">
                      <p className="text-xs text-[#263238]/50 mb-2">Hạn chế:</p>
                      <div className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-xs text-[#263238]/50">• {limitation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#263238] via-[#1E293B] to-[#263238]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-4 text-3xl">
              Sẵn sàng tìm công việc mơ ước?
            </h2>
            <p className="text-xl mb-8 text-white/80">
              Tham gia cùng hàng nghìn ứng viên đã thăng tiến sự nghiệp
            </p>
            <Button
              onClick={() => !user ? navigate('/register') : navigate('/jobs')}
              className="bg-[#FF9800] hover:bg-[#F57C00] text-white h-14 px-8 text-lg shadow-lg shadow-[#FF9800]/30 rounded-xl"
            >
              {user ? 'Xem Việc Làm' : 'Bắt Đầu Miễn Phí'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}