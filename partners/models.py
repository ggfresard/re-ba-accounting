from django.db import models
from accounts.models import User
from django.utils.timezone import now


# Create your models here.


class Partner(models.Model):
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, null=True)
    rut = models.CharField(max_length=20, unique=True, null=True)
    owner = models.ForeignKey(
        User, related_name='partners', on_delete=models.CASCADE)

    def __str__(self):
        return self.name+' '+self.last_name if self.last_name else ''


class Expense(models.Model):
    description = models.CharField(max_length=200)
    amount = models.BigIntegerField(default=0)
    owner = models.ForeignKey(
        User, related_name='expenses', on_delete=models.CASCADE)
    partner = models.ForeignKey(
        Partner, on_delete=models.DO_NOTHING, null=True)
    is_variable = models.BooleanField(null=True)
    amount_paid = models.BigIntegerField(null=True)
    date = models.DateField(default=now)

    def save(self, *args, **kwargs):
        if not self.partner:
            self.partner = self.owner.partner
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.description+" "+self.amount
