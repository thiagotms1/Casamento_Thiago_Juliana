// Wedding RSVP Website JavaScript
// Thiago & Juliana - 07 de Setembro 2025

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades
    initCountdown();
    initNavigation();
    initRSVPForm();
    initBackToTop();
    initFormConditionals();
});

// ========================================
// CONTADOR REGRESSIVO
// ========================================
function initCountdown() {
    const weddingDate = new Date('2025-09-07T00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Atualizar elementos do DOM
            updateElement('days', days);
            updateElement('hours', hours);
            updateElement('minutes', minutes);
            updateElement('seconds', seconds);
        } else {
            // Casamento já aconteceu!
            document.querySelector('.countdown').innerHTML = `
                <div class="countdown__celebration">
                    <span class="countdown__number">🎉</span>
                    <span class="countdown__label">Casamos!</span>
                </div>
            `;
        }
    }
    
    function updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value.toString().padStart(2, '0');
        }
    }
    
    // Atualizar contador a cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ========================================
// NAVEGAÇÃO SUAVE
// ========================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Destacar link ativo na navegação
    window.addEventListener('scroll', highlightActiveNavLink);
}

function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    const navHeight = document.querySelector('.nav').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// ========================================
// FORMULÁRIO RSVP
// ========================================
function initRSVPForm() {
    const form = document.getElementById('rsvp-form');
    const confirmationMessage = document.getElementById('confirmation-message');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function initFormConditionals() {
    const confirmacaoSelect = document.getElementById('confirmacao');
    const acompanhantesGroup = document.getElementById('acompanhantes-group');
    
    if (confirmacaoSelect && acompanhantesGroup) {
        confirmacaoSelect.addEventListener('change', function() {
            if (this.value === 'Não') {
                acompanhantesGroup.style.display = 'none';
                document.getElementById('acompanhantes').value = '0';
            } else {
                acompanhantesGroup.style.display = 'block';
            }
        });
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validar formulário
    if (!validateForm(form)) {
        return;
    }
    
    // Mostrar estado de carregamento
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando... 💌';
    submitButton.disabled = true;
    
    try {
        // Coletar dados do formulário
        const rsvpData = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            telefone: formData.get('telefone') || 'Não informado',
            confirmacao: formData.get('confirmacao'),
            acompanhantes: formData.get('acompanhantes') || '0',
            observacoes: formData.get('observacoes') || 'Nenhuma',
            timestamp: new Date().toLocaleString('pt-BR')
        };
        
        // CONFIGURAÇÃO DO EMAILJS
        // Para configurar o EmailJS, siga os passos:
        // 1. Acesse https://www.emailjs.com/ e crie uma conta
        // 2. Crie um novo serviço de email (Gmail, Outlook, etc.)
        // 3. Crie um template de email com as variáveis:
        //    - {{nome}}, {{email}}, {{telefone}}, {{confirmacao}}, 
        //    - {{acompanhantes}}, {{observacoes}}, {{timestamp}}
        // 4. Obtenha seu USER_ID, SERVICE_ID e TEMPLATE_ID
        // 5. Descomente e configure as linhas abaixo:
        
        /*
        // Inicializar EmailJS (substitua 'YOUR_USER_ID' pelo seu ID)
        emailjs.init('YOUR_USER_ID');
        
        // Enviar email (substitua os IDs pelos seus)
        const result = await emailjs.send(
            'YOUR_SERVICE_ID',    // Ex: 'service_abc123'
            'YOUR_TEMPLATE_ID',   // Ex: 'template_xyz789'
            rsvpData
        );
        
        console.log('Email enviado com sucesso:', result);
        */
        
        // SIMULAÇÃO DE ENVIO (remover quando EmailJS estiver configurado)
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Dados do RSVP:', rsvpData);
        
        // Mostrar mensagem de confirmação
        showConfirmationMessage();
        form.reset();
        
    } catch (error) {
        console.error('Erro ao enviar RSVP:', error);
        alert('Ocorreu um erro ao enviar sua confirmação. Tente novamente ou entre em contato conosco diretamente.');
    } finally {
        // Restaurar botão
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Este campo é obrigatório');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Validar email específicamente
    const emailField = form.querySelector('#email');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Por favor, insira um email válido');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#c53030';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#c53030';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '4px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showConfirmationMessage() {
    const form = document.getElementById('rsvp-form');
    const confirmationMessage = document.getElementById('confirmation-message');
    
    if (form && confirmationMessage) {
        form.classList.add('hidden');
        confirmationMessage.classList.remove('hidden');
        confirmationMessage.classList.add('fade-in');
        
        // Scroll para a mensagem
        confirmationMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Opcional: voltar ao formulário após alguns segundos
        setTimeout(() => {
            if (confirm('Deseja fazer outra confirmação?')) {
                form.classList.remove('hidden');
                confirmationMessage.classList.add('hidden');
            }
        }, 5000);
    }
}

// ========================================
// BOTÃO VOLTAR AO TOPO
// ========================================
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Mostrar/esconder botão baseado no scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.style.opacity = '1';
            } else {
                backToTopButton.style.opacity = '0.7';
            }
        });
    }
}

// ========================================
// ANIMAÇÕES E EFEITOS VISUAIS
// ========================================

// Animação de entrada para elementos quando entram na viewport
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll(
        '.detail-card, .info-card, .about__text, .photo-placeholder'
    );
    
    animatedElements.forEach(el => observer.observe(el));
}

// Inicializar animações quando a página carregar
window.addEventListener('load', initScrollAnimations);

// ========================================
// UTILITÁRIOS
// ========================================

// Função para formatar data brasileira
function formatDateBR(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Função para detectar dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para compartilhar nas redes sociais (futura implementação)
function shareWedding(platform) {
    const title = 'Casamento Thiago & Juliana - 07 de Setembro 2025';
    const text = 'Venha celebrar conosco nosso grande dia!';
    const url = window.location.href;
    
    switch(platform) {
        case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
            break;
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            break;
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
            break;
    }
}

// ========================================
// CONFIGURAÇÕES AVANÇADAS PARA EMAILJS
// ========================================

/*
INSTRUÇÕES DETALHADAS PARA CONFIGURAR O EMAILJS:

1. CRIAR CONTA NO EMAILJS:
   - Acesse https://www.emailjs.com/
   - Registre-se gratuitamente
   - Confirme seu email

2. CONFIGURAR SERVIÇO DE EMAIL:
   - No dashboard, vá em "Email Services"
   - Clique em "Add New Service"
   - Escolha seu provedor (Gmail, Outlook, etc.)
   - Conecte sua conta de email
   - Anote o SERVICE_ID gerado

3. CRIAR TEMPLATE DE EMAIL:
   - Vá em "Email Templates"
   - Clique em "Create New Template"
   - Configure o template com as seguintes variáveis:
   
   Subject: Novo RSVP - {{nome}} - Casamento Thiago & Juliana
   
   Body:
   Olá Thiago e Juliana!
   
   Receberam uma nova confirmação de presença:
   
   Nome: {{nome}}
   Email: {{email}}
   Telefone: {{telefone}}
   Confirmação: {{confirmacao}}
   Acompanhantes: {{acompanhantes}}
   Observações: {{observacoes}}
   
   Data/Hora: {{timestamp}}
   
   Enviado automaticamente pelo site do casamento.
   
   - Anote o TEMPLATE_ID gerado

4. OBTER USER_ID:
   - Vá em "Account" > "General"
   - Copie o "User ID"

5. ADICIONAR SCRIPT DO EMAILJS NO HTML:
   - Adicione antes do fechamento do </body>:
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

6. CONFIGURAR NO JAVASCRIPT:
   - Descomente as linhas marcadas acima
   - Substitua 'YOUR_USER_ID' pelo seu User ID
   - Substitua 'YOUR_SERVICE_ID' pelo seu Service ID  
   - Substitua 'YOUR_TEMPLATE_ID' pelo seu Template ID

7. TESTAR:
   - Faça um teste de envio
   - Verifique se o email chegou corretamente

EXEMPLO DE CONFIGURAÇÃO FINAL:
emailjs.init('user_abc123xyz');
const result = await emailjs.send('service_gmail123', 'template_rsvp456', rsvpData);

IMPORTANTE:
- O EmailJS tem limite de 200 emails gratuitos por mês
- Para mais emails, considere um plano pago
- Sempre teste antes de publicar o site
*/

// Log para debug (remover em produção)
console.log('Sistema RSVP Thiago & Juliana carregado com sucesso! 💕');