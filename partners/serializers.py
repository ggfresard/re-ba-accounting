from django.db.models import fields
from rest_framework import serializers
from .models import Expense, Partner


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ['id', 'name', 'last_name', 'rut']


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['partner', 'id', 'amount',
                  'description', 'amount_paid', 'is_variable', 'date']
