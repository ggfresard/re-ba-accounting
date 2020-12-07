from django.contrib import admin
from .models import Expense, Partner

# Register your models here.
admin.site.register(Partner)
admin.site.register(Expense)
