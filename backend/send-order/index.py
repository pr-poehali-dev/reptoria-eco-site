import os
import json
import smtplib
from email.mime.text import MIMEText

from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет уведомление о заказе или оптовой заявке на почту владельца."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    order_type = body.get('type', 'order')

    smtp_host = os.environ.get('SMTP_HOST', 'smtp.yandex.ru')
    smtp_port = int(os.environ.get('SMTP_PORT', '465'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_pass = os.environ.get('SMTP_PASS', '')
    recipient = os.environ.get('NOTIFY_EMAIL', 'polin.victor111@yandex.ru')

    if order_type == 'wholesale':
        subject = '🐾 Новая оптовая заявка'
        items_text = '\n'.join([f"  - {it['name']} × {it['qty']} шт." for it in body.get('items', [])])
        payment_map = {'sbp': 'СБП', 'card': 'Перевод на карту', 'invoice': 'Оплата по счёту'}
        payment = payment_map.get(body.get('payment', ''), body.get('payment', '—'))
        html = f"""
<h2>Новая оптовая заявка</h2>
<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
  <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Имя:</td><td style="padding:6px 12px">{body.get('name','—')}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Телефон:</td><td style="padding:6px 12px">{body.get('phone','—')}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Email:</td><td style="padding:6px 12px">{body.get('email','—')}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Адрес доставки:</td><td style="padding:6px 12px">{body.get('address','—')}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Способ оплаты:</td><td style="padding:6px 12px">{payment}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;color:#555;vertical-align:top">Состав заказа:</td><td style="padding:6px 12px"><pre style="margin:0">{items_text}</pre></td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Комментарий:</td><td style="padding:6px 12px">{body.get('comment','—')}</td></tr>
</table>
"""
    else:
        subject = '🛒 Новый заказ с сайта'
        items_text = '\n'.join([f"  - {it['name']} × {it['qty']} шт. = {it['total']} ₽" for it in body.get('items', [])])
        html = f"""
<h2>Новый заказ с сайта</h2>
<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
  <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Имя:</td><td style="padding:6px 12px">{body.get('name','—')}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Телефон:</td><td style="padding:6px 12px">{body.get('phone','—')}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Адрес доставки:</td><td style="padding:6px 12px">{body.get('address','—')}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;color:#555;vertical-align:top">Товары:</td><td style="padding:6px 12px"><pre style="margin:0">{items_text}</pre></td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Итого:</td><td style="padding:6px 12px"><b>{body.get('total','—')} ₽</b></td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Комментарий:</td><td style="padding:6px 12px">{body.get('comment','—')}</td></tr>
</table>
"""

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = smtp_user
    msg['To'] = recipient
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, recipient, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }