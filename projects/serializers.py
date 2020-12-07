from django.core.exceptions import ValidationError
from django.db.models import fields
from rest_framework.serializers import ModelSerializer
from partners.models import Partner
from django.db import transaction
from rest_framework import serializers
from .models import Flow, Participation, Project


class ParticipationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participation
        fields = ['participation', 'partner']


class FlowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flow
        fields = ['description', 'partner',
                  'date', 'receipt_number', 'project', 'confirmed', 'amount', 'id']


class ProjectSerializer(serializers.ModelSerializer):
    participants = ParticipationSerializer(
        source='participation_set', many=True, read_only=True)
    flows = FlowSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['name', 'participants', 'client',
                  'total_amount', 'id', 'flows']
        depth = 1

    @transaction.atomic
    def update(self, instance, validated_data):
        participants = self.initial_data.get("participants")
        total = 0
        for participant in participants:
            total += participant.get("participation")
        if abs(100-total) > 0.01:
            raise serializers.ValidationError(
                "Participations don't add up to 100%")
        Participation.objects.filter(project=instance).delete()
        for participant in participants:
            id = participant.get("partner")
            participation = participant.get("participation")
            new_participant = Partner.objects.get(pk=id)
            Participation(project=instance, partner=new_participant,
                          participation=participation).save()
        instance.__dict__.update(**validated_data)
        instance.save()
        return instance

    @transaction.atomic
    def create(self, validated_data):
        project = Project.objects.create(**validated_data)
        participations = []
        total = 0
        if "participants" in self.initial_data:
            participants = self.initial_data.get("participants")
            for participant in participants:
                id = participant.get("partner")
                participation = participant.get("participation")
                total += participation
                participant_instance = Partner.objects.get(pk=id)
                participations.append(Participation(project=project, partner=participant_instance,
                                                    participation=participation))
        if abs(100-total) > 0.01:
            raise serializers.ValidationError(
                "Participations don't add up to 100%")
        for participation in participations:
            participation.save()
        project.save()
        return project


class FlowConfirmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flow
        fields = ['receipt_number', 'confirmed']
