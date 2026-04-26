const messages = {
  emptyRecipient: {
    ka: 'გთხოვთ შეიყვანოთ მიმღების კონტაქტი.',
    ru: 'Пожалуйста, введите контакт получателя.',
    en: 'Please enter recipient contact.',
  },
  invalidEmail: {
    ka: 'გთხოვთ შეიყვანოთ სწორი ელ-ფოსტა.',
    ru: 'Пожалуйста, введите корректный Email.',
    en: 'Please enter a valid email address.',
  },
  invalidPhone: {
    ka: 'გთხოვთ შეიყვანოთ სწორი ტელეფონის ნომერი (+995XXXXXXXXX).',
    ru: 'Пожалуйста, введите корректный номер телефона (+995XXXXXXXXX).',
    en: 'Please enter a valid phone number (+995XXXXXXXXX).',
  },
  missingDateTime: {
    ka: 'გთხოვთ აირჩიოთ თარიღი და დრო.',
    ru: 'Пожалуйста, выберите дату и время.',
    en: 'Please select date and time.',
  },
  pastDateTime: {
    ka: 'გეგმილი გაგზავნის დრო მომავალში უნდა იყოს.',
    ru: 'Запланированное время отправки должно быть в будущем.',
    en: 'Scheduled send time must be in the future.',
  },
};

function getMessage(language, key) {
  return messages[key][language] ?? messages[key].en;
}

export function createEmptySchedule() {
  return {
    isAutoSend: false,
    recipient: '',
    sendMethod: 'email',
    scheduledDate: '',
    scheduledTime: '',
  };
}

export function normalizeScheduleDraft(input = {}) {
  return {
    isAutoSend: Boolean(input.isAutoSend),
    recipient: input.recipient ?? input.autoSendRecipient ?? '',
    sendMethod: input.sendMethod === 'phone' ? 'phone' : 'email',
    scheduledDate: input.scheduledDate ?? '',
    scheduledTime: input.scheduledTime ?? '',
  };
}

export function getScheduleFromCard(card) {
  return normalizeScheduleDraft({
    isAutoSend: card?.isAutoSend,
    autoSendRecipient: card?.autoSendRecipient,
    sendMethod: card?.sendMethod,
    scheduledDate: card?.scheduledDate,
    scheduledTime: card?.scheduledTime,
  });
}

export function normalizeRecipientInput(method, rawValue) {
  if (method !== 'phone') {
    return rawValue;
  }

  const cleaned = rawValue.replace(/[^\d+]/g, '');

  if (!cleaned) {
    return '';
  }

  if (cleaned.startsWith('+995')) {
    return `+995${cleaned.slice(4).replace(/\D/g, '').slice(0, 9)}`;
  }

  const digits = cleaned.replace(/\D/g, '');

  if (digits.startsWith('995')) {
    return `+995${digits.slice(3, 12)}`;
  }

  return `+995${digits.slice(0, 9)}`;
}

export function getGuestCountFromCard(card) {
  if (!card?.imagesJson) return 0;
  try {
    const data = typeof card.imagesJson === 'string' ? JSON.parse(card.imagesJson) : card.imagesJson;
    const phones = data.phones || [];
    const seating = data.seating || [];
    const guests = new Set([...phones, ...seating.map(s => s.phone)].filter(Boolean));
    return guests.size;
  } catch (e) {
    return 0;
  }
}

export function validateScheduleDraft(schedule, language, cardType) {
  if (!schedule.isAutoSend) {
    return '';
  }

  // For invitations, recipient can be empty if we're using GUESTS_LIST
  const isInvitation = cardType === 'invitation';
  const effectiveRecipient = isInvitation && !schedule.recipient.trim() ? 'GUESTS_LIST' : schedule.recipient.trim();

  if (!effectiveRecipient) {
    return getMessage(language, 'emptyRecipient');
  }

  if (schedule.sendMethod === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(effectiveRecipient)) {
      return getMessage(language, 'invalidEmail');
    }
  } else {
    if (effectiveRecipient === 'GUESTS_LIST') {
      return '';
    }
    const phoneRegex = /^\+995\d{9}$/;
    if (!phoneRegex.test(effectiveRecipient)) {
      return getMessage(language, 'invalidPhone');
    }
  }

  if (!schedule.scheduledDate || !schedule.scheduledTime) {
    return getMessage(language, 'missingDateTime');
  }

  const scheduledAt = new Date(`${schedule.scheduledDate}T${schedule.scheduledTime}`);
  if (Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
    return getMessage(language, 'pastDateTime');
  }

  return '';
}

