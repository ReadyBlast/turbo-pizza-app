'use client';

import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  CheckoutAddressForm,
  CheckoutCart,
  CheckoutPersonalForm,
  CheckoutSidebar,
  Container,
  Title,
} from '@/shared/components/shared';
import {
  checkoutFormSchema,
  CheckoutFormSchemaValues,
} from '@/shared/components/constants/checkout-form-schema';
import { useCart } from '@/shared/hooks';
import { createOrder } from '@/app/actions';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function CheckoutPage() {
  const [submitting, setSubmitting] = useState(false);
  const { totalAmount, items, loading, updateItemQuantity, removeCartItem } =
    useCart();

  const form = useForm<CheckoutFormSchemaValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      comment: '',
    },
  });

  const onSubmit: SubmitHandler<CheckoutFormSchemaValues> = async (data) => {
    try {
      setSubmitting(true);
      const url = await createOrder(data);

      toast.success('Заказ оформлен. Переход на оплату...', {
        icon: '✅',
      });

      if (url) {
        location.href = url
      }
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      toast.error('Не удалось оформить заказ', {
        icon: '❌',
      });
    }
  };

  const onClickCountButton = (
    id: number,
    quantity: number,
    type: 'plus' | 'minus',
  ) => {
    const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  return (
    <Container className="mt-10">
      <Title
        text="Оформление заказа"
        size="xl"
        className="font-extrabold mb-8 text-[36px]"
      />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-10">
            {/** Левая часть */}
            <div className="flex flex-col gap-10 flex-1 mb-20">
              <CheckoutCart
                onClickCountButton={onClickCountButton}
                removeCartItem={removeCartItem}
                items={items}
                loading={loading}
              />

              <CheckoutPersonalForm
                className={loading ? 'opacity-50 pointer-events-none' : ''}
              />

              <CheckoutAddressForm
                className={loading ? 'opacity-50 pointer-events-none' : ''}
              />
            </div>

            {/** Правая часть */}
            <CheckoutSidebar
              
              totalAmount={totalAmount}
              className="w-[450px]"
              loading={loading || submitting}
            />
          </div>
        </form>
      </FormProvider>
    </Container>
  );
}
