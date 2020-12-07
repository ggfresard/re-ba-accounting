from accounts.models import User
from django.db import models
from partners.models import Partner
from django.utils.timezone import now
import datetime

# Create your models here.


class Project(models.Model):
    name = models.CharField(max_length=200)
    client = models.CharField(max_length=200, null=True)
    participants = models.ManyToManyField(
        Partner, through='Participation', related_name='participants')
    owner = models.ForeignKey(
        User, related_name='projects', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_amount = models.BigIntegerField(default=0)

    def __str__(self):
        return self.name


class Participation(models.Model):
    partner = models.ForeignKey(Partner, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    participation = models.FloatField(default=0)

    class Meta:
        unique_together = [['partner', 'project']]

    def __str__(self):
        return 'Partner '+str(self.partner) + ' '+str(self.participation)+'%'


class Flow(models.Model):
    amount = models.BigIntegerField(default=1)
    date = models.DateField(default=now)
    receipt_number = models.CharField(max_length=200, blank=True)
    description = models.CharField(max_length=200)
    partner = models.ForeignKey(
        Partner, on_delete=models.DO_NOTHING, null=True)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='flows')
    confirmed = models.BooleanField(default=False)

    def __str__(self):
        return '{} {}'.format(self.amount, self.description)
