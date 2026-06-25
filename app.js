document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Gallery Image Thumbnails Navigation
    const thumbs = document.querySelectorAll('.thumb-btn');
    const mainImg = document.getElementById('main-product-img');
    
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            
            mainImg.style.opacity = 0;
            setTimeout(() => {
                mainImg.src = thumb.getAttribute('data-img');
                mainImg.style.opacity = 1;
            }, 150);
        });
    });

    // 2. Toggle active class on promotional cards
    const promoOptions = document.querySelectorAll('.promo-option');
    
    promoOptions.forEach(option => {
        option.addEventListener('click', () => {
            promoOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            const radio = option.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
        });
    });

    // 3. Autoplay HTML5 MP4 Video Integration
    const videoWrapper = document.getElementById('video-wrapper');
    if (videoWrapper) {
        videoWrapper.addEventListener('click', () => {
            videoWrapper.innerHTML = `
                <video src="https://gv.videocdn.alibaba.com/icbu_vod_video/video_target/gv98-0c1ae0d2-a1bfe0ad-980224fb-239e/trans/aidc/nmjvft-h264-hd.mp4?bizCode=icbu_vod_video" 
                    autoplay 
                    controls 
                    playsinline 
                    style="width: 100%; height: 100%; object-fit: cover; border: 0;">
                </video>
            `;
            videoWrapper.style.cursor = 'default';
        });
    }

    // 4. Legal Modal Navigation
    const modal = document.getElementById('legal-modal');
    const closeBtn = document.getElementById('modal-close');
    const triggers = document.querySelectorAll('.legal-trigger');
    const tabBtns = document.querySelectorAll('.modal-tab-btn');
    const panes = document.querySelectorAll('.modal-text-pane');

    function switchTab(tabId) {
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-modal-tab') === tabId);
        });
        panes.forEach(pane => {
            pane.classList.toggle('active', pane.id === `modal-content-${tabId}`);
        });
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = trigger.getAttribute('data-tab');
            switchTab(tabId);
            modal.classList.add('open');
        });
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-modal-tab');
            switchTab(tabId);
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });

    // 5. Social Proof Popup Loop (Real-time live notifications)
    const socialProofPopup = document.getElementById('social-proof-popup');
    const popupText = document.getElementById('popup-text');
    
    const peruvianBuyers = [
        { name: 'Sofía', location: 'San Borja, Lima', product: '1 Unidad (Lamicall STRY01)' },
        { name: 'Carlos', location: 'Santiago de Surco, Lima', product: '🔥 Pack Duplo Lamicall STRY01' },
        { name: 'Mariela', location: 'Miraflores, Lima', product: '🔥 Pack Duplo Lamicall STRY01' },
        { name: 'Diego', location: 'Los Olivos, Lima', product: '1 Unidad (Lamicall STRY01)' },
        { name: 'Alessandra', location: 'La Molina, Lima', product: '🔥 Pack Duplo Lamicall STRY01' },
        { name: 'Juan Manuel', location: 'Trujillo', product: '1 Unidad (Lamicall STRY01)' },
        { name: 'Renzo', location: 'Cercado, Arequipa', product: '🔥 Pack Duplo Lamicall STRY01' },
        { name: 'Camila', location: 'San Miguel, Lima', product: '1 Unidad (Lamicall STRY01)' },
        { name: 'Christian', location: 'Chiclayo', product: '🔥 Pack Duplo Lamicall STRY01' }
    ];
    
    function showNotification() {
        const buyer = peruvianBuyers[Math.floor(Math.random() * peruvianBuyers.length)];
        popupText.innerHTML = `<strong>${buyer.name}</strong> de ${buyer.location} <strong>acaba de comprar</strong> ${buyer.product}`;
        socialProofPopup.classList.add('show');
        
        setTimeout(() => {
            socialProofPopup.classList.remove('show');
        }, 5000);
    }
    
    setTimeout(showNotification, 6000);
    setInterval(showNotification, 25000);

    // 6. Dynamic Payment Restriction based on Region (Audit Fix)
    const regionSelect = document.getElementById('region');
    const radioContraentrega = document.getElementById('payment-contraentrega');
    const radioTransferencia = document.getElementById('payment-transferencia');
    const paymentNote = document.getElementById('payment-note');

    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            if (regionSelect.value !== 'Lima') {
                // If it is province (not Lima), force Bank Transfer/Yape (COD is not available)
                radioTransferencia.checked = true;
                radioContraentrega.disabled = true;
                paymentNote.innerText = '⚠️ El pago contra entrega solo está disponible en Lima y Callao. Para provincias, el envío se procesa previo pago por seguridad logística (Shalom/Olva).';
            } else {
                // If it is Lima, enable both options
                radioContraentrega.disabled = false;
                paymentNote.innerText = '';
            }
        });
    }

    // 7. Form Submission & WhatsApp Link Generation
    const form = document.getElementById('purchase-form');
    const formError = document.getElementById('form-error');
    
    // Cart Drawer Toggle Logic
    const cartDrawer = document.getElementById('cart-drawer');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
    const packButtons = document.querySelectorAll('.select-pack-btn');
    const ctaButtonHero = document.querySelector('.cta-button');

    const cartVariantSelect = document.getElementById('cart-variant-select');
    const hiddenVariantInput = document.getElementById('selected-promo-variant');

    function openCart(variantValue) {
        if (cartVariantSelect) {
            cartVariantSelect.value = variantValue;
        }
        if (hiddenVariantInput) {
            hiddenVariantInput.value = variantValue;
        }
        
        updateShippingNotice();

        // Pixel tracking: AddToCart
        if (typeof fbq === 'function') {
            fbq('track', 'AddToCart');
        }
        if (typeof ttq === 'object') {
            ttq.track('AddToCart');
        }

        if (cartDrawer) {
            cartDrawer.classList.add('open');
        }
    }

    const shippingBadgeText = document.getElementById('shipping-badge-text');
    const cartShippingNotice = document.getElementById('cart-shipping-notice');
    const wholesaleQtyContainer = document.getElementById('wholesale-qty-container');
    const wholesaleQtyInput = document.getElementById('wholesale-qty-input');

    function updateShippingNotice() {
        const val = cartVariantSelect ? cartVariantSelect.value : '1_unidad';
        const region = regionSelect ? regionSelect.value : 'Lima';
        
        if (!cartShippingNotice || !shippingBadgeText) return;
        
        if (val === 'mayorista') {
            if (wholesaleQtyContainer) wholesaleQtyContainer.style.display = 'block';
            shippingBadgeText.innerText = 'Envío: A cotizar';
            cartShippingNotice.innerText = '💡 Ingresa la cantidad de unidades que deseas solicitar a precio de mayorista (mínimo 4).';
        } else {
            if (wholesaleQtyContainer) wholesaleQtyContainer.style.display = 'none';
            if (val === '1_unidad') {
                const cost = (region === 'Lima') ? 'S/. 10.00' : 'S/. 15.00';
                shippingBadgeText.innerText = `Envío: ${cost}`;
                cartShippingNotice.innerText = `💡 Te falta comprar 1 unidad más para obtener ENVÍO GRATIS a todo el Perú (Ahorras ${cost}).`;
            } else {
                shippingBadgeText.innerText = 'Envío Gratis Nacional';
                cartShippingNotice.innerText = '🎉 ¡Tu compra califica para Envío Gratis a todo el Perú!';
            }
        }
    }

    if (cartVariantSelect) {
        cartVariantSelect.addEventListener('change', () => {
            if (hiddenVariantInput) {
                hiddenVariantInput.value = cartVariantSelect.value;
            }
            updateShippingNotice();
        });
    }

    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            if (regionSelect.value !== 'Lima') {
                radioTransferencia.checked = true;
                radioContraentrega.disabled = true;
                paymentNote.innerText = '⚠️ El pago contra entrega solo está disponible en Lima y Callao. Para provincias, el envío se procesa previo pago por seguridad logística (Shalom/Olva).';
            } else {
                radioContraentrega.disabled = false;
                paymentNote.innerText = '';
            }
            updateShippingNotice();
        });
    }

    function closeCart() {
        if (cartDrawer) {
            cartDrawer.classList.remove('open');
        }
    }

    if (cartCloseBtn && cartDrawerOverlay) {
        cartCloseBtn.addEventListener('click', closeCart);
        cartDrawerOverlay.addEventListener('click', closeCart);
    }

    packButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pack = btn.getAttribute('data-pack-select');
            openCart(pack);
        });
    });

    if (ctaButtonHero) {
        ctaButtonHero.addEventListener('click', (e) => {
            e.preventDefault();
            // Default to best seller (2 units)
            openCart('2_unidades');
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const address = document.getElementById('address').value.trim();
            const district = document.getElementById('district').value.trim();
            const region = document.getElementById('region').value;
            
            if (formError) {
                formError.innerText = '';
                formError.style.color = 'var(--danger)';
            }
            
            const phoneRegex = /^9\d{8}$/;
            if (!phoneRegex.test(phone)) {
                if (formError) {
                    formError.innerText = '❌ Por favor, ingresa un número de celular peruano válido (Debe tener 9 dígitos y empezar con 9).';
                }
                return;
            }

            // Safety enforcement check
            if (region !== 'Lima' && radioContraentrega.checked) {
                if (formError) {
                    formError.innerText = '❌ El pago contra entrega no está disponible fuera de Lima. Selecciona Yape/Transferencia.';
                }
                radioTransferencia.checked = true;
                return;
            }
            
            const selectedPromoValue = hiddenVariantInput ? hiddenVariantInput.value : '1_unidad';
            
            // Validate Wholesale Quantity (Minimum 4)
            if (selectedPromoValue === 'mayorista') {
                const qtyVal = wholesaleQtyInput ? parseInt(wholesaleQtyInput.value, 10) : 4;
                if (isNaN(qtyVal) || qtyVal < 4) {
                    if (formError) {
                        formError.innerText = '❌ El pedido mayorista requiere un mínimo de 4 unidades.';
                    }
                    return;
                }
            }

            let promoText = '';
            let productPrice = '';
            let shippingCostText = '';
            let totalPrice = '';
            
            if (selectedPromoValue === '1_unidad') {
                promoText = '1 Unidad Soporte Lamicall STRY01 Original';
                productPrice = 'S/. 49.90';
                if (region === 'Lima') {
                    shippingCostText = 'S/. 10.00';
                    totalPrice = 'S/. 59.90';
                } else {
                    shippingCostText = 'S/. 15.00';
                    totalPrice = 'S/. 64.90';
                }
            } else if (selectedPromoValue === '2_unidades') {
                promoText = 'Pack Duplo (2 Soportes Lamicall STRY01 + Envio Gratis)';
                productPrice = 'S/. 89.90';
                shippingCostText = 'Gratis';
                totalPrice = 'S/. 89.90';
            } else if (selectedPromoValue === '3_unidades') {
                promoText = 'Pack Familiar (3 Soportes Lamicall STRY01 + Envio Gratis)';
                productPrice = 'S/. 129.90';
                shippingCostText = 'Gratis';
                totalPrice = 'S/. 129.90';
            } else if (selectedPromoValue === 'mayorista') {
                const qtyVal = wholesaleQtyInput ? parseInt(wholesaleQtyInput.value, 10) : 4;
                const finalQty = isNaN(qtyVal) || qtyVal < 4 ? 4 : qtyVal;
                promoText = `Precio Mayorista / Revendedor (Lamicall STRY01 x ${finalQty} unidades)`;
                productPrice = `S/. ${(finalQty * 39.90).toFixed(2)} (S/. 39.90 c/u)`;
                shippingCostText = 'A cotizar según volumen';
                totalPrice = `S/. ${(finalQty * 39.90).toFixed(2)} + envío a cotizar`;
            }
            
            const paymentRadio = document.querySelector('input[name="payment"]:checked');
            const paymentMethod = paymentRadio.value === 'contraentrega' 
                ? 'Pagar al recibir (Efectivo/Yape/Plin)' 
                : 'Transferencia Directa (BCP/BBVA/Interbank/Yape)';
                
            const orderId = 'NG-' + Math.floor(100000 + Math.random() * 900000);
            const whatsappNumber = '51910352290'; 
            
            const message = `*NUEVO PEDIDO EN ZELKOVA PERU*\n` +
                            `-----------------------------------------\n` +
                            `*Pedido ID:* #${orderId}\n\n` +
                            `*Producto:* ${promoText}\n` +
                            `*Precio Producto:* ${productPrice}\n` +
                            `*Costo de Envio:* ${shippingCostText}\n` +
                            `*Total a pagar:* *${totalPrice}*\n` +
                            `*Metodo de Pago:* ${paymentMethod}\n\n` +
                            `*Cliente:* ${fullname}\n` +
                            `*Celular:* ${phone}\n` +
                            `*Direccion:* ${address}\n` +
                            `*Distrito:* ${district}\n` +
                            `*Departamento:* ${region}\n\n` +
                            `-----------------------------------------\n` +
                            `*Hola! Quiero saber si tienen stock disponible de este producto para coordinar mi entrega.*`;
                            
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            if (formError) {
                formError.style.color = '#10b981'; // Green success color
                formError.innerText = `¡Pedido #${orderId} registrado! Redirigiendo a WhatsApp...`;
            }

            const numericPrice = parseFloat(totalPrice.replace(/[^\d.]/g, '')) || 0;

            // Tracking: Meta Purchase
            if (typeof fbq === 'function') {
                fbq('track', 'Purchase', {
                    value: numericPrice,
                    currency: 'PEN',
                    content_name: promoText
                });
            }

            // Tracking: TikTok CompletePayment
            if (typeof ttq === 'object') {
                ttq.track('CompletePayment', {
                    value: numericPrice,
                    currency: 'PEN',
                    content_name: promoText
                });
            }
            
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 1200);
        });
    }

    // 8. Floating WhatsApp Interactive Menu Options
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const whatsappMenu = document.getElementById('whatsapp-menu');
    
    if (whatsappBtn && whatsappMenu) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            whatsappMenu.classList.toggle('show');
        });
        
        document.addEventListener('click', (e) => {
            if (!whatsappMenu.contains(e.target) && e.target !== whatsappBtn) {
                whatsappMenu.classList.remove('show');
            }
        });
        
        const optComprar = document.getElementById('wa-opt-comprar');
        const optDuda = document.getElementById('wa-opt-duda');
        const optConsulta = document.getElementById('wa-opt-consulta');
        const whatsappNumber = '51910352290';
        
        if (optComprar) {
            optComprar.addEventListener('click', () => {
                whatsappMenu.classList.remove('show');
                const orderForm = document.getElementById('order-form-section');
                if (orderForm) {
                    orderForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
        
        if (optDuda) {
            optDuda.addEventListener('click', () => {
                whatsappMenu.classList.remove('show');
                const msg = encodeURIComponent("Hola! Ya realice mi compra en Zelkova y tengo una consulta sobre mi despacho.");
                window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
            });
        }
        
        if (optConsulta) {
            optConsulta.addEventListener('click', () => {
                whatsappMenu.classList.remove('show');
                const msg = encodeURIComponent("Hola! Quisiera realizar una consulta sobre el soporte de celular Lamicall STRY01.");
                window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
            });
        }
    }

    // 9. Interactive FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            
            // Close other FAQ items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            item.classList.toggle('active');
        });
    });
});
