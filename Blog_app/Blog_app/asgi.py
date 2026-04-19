"""
ASGI config for Blog_app project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
settings_module='Blog_app.deployment_settings' if 'RENDER_EXTERNAL_HOSTNAME' in os.environ else 'Blog_app.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

application = get_asgi_application()
